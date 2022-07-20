import { MessageRoom, Room, SearchArticleRequest, SearchClusterList } from '../type/land';
import { addDocuments, getDeletedRooms, getNewRooms, getRooms, removeDocuments } from '../lib/mongo';
import { getArticleDetail, getClusters } from '../lib/land';
import { getDetail } from '../service/article';
import { writeDocumentsForRoomDetail } from '../service/article';
import { writeDocumentsForRooms } from '../service/article';
import { getArticleList } from '../service/article';
import { NAVER_ARTICLE_DETAIL_URL } from '../util/naverland';
import { sendMessage } from '../lib/telegram';
import { getKoreaTimezoneString, getUTCDate } from '../lib/date';
import { sleep } from '../lib/common';
import { COLLECTION_ROOM, COLLECTION_ROOM_DELETED } from '../data/config';

export async function cleanUpInvalidArticles(): Promise<void> {
    const rooms = ((await getRooms()) as Room[]).filter((room) => !room?.deletedAt);
    const invalidRooms = [];
    for (const room of rooms) {
        const response = await getArticleDetail(room.atclNo);
        if (response.indexOf('요청하신 페이지를 찾을 수 없습니다.</strong>') !== -1) {
            invalidRooms.push(room);
        }
    }
    console.log(`✂️ 유효하지 않은 매물 ${invalidRooms.length}(/${rooms.length})개를 정리했습니다.`);
    console.log('===============================================');
    if (!invalidRooms.length) return;

    const deletedRooms = invalidRooms.map((room) => ({ ...room, deletedAt: getUTCDate() }));
    await removeDocuments(COLLECTION_ROOM, invalidRooms);
    await addDocuments(COLLECTION_ROOM_DELETED, deletedRooms);
}

export async function requestClusters(clusters: SearchClusterList[]): Promise<void> {
    for (const cluster of clusters) {
        console.log(`🚀 ${cluster.pCortarNo} 권역 파싱 중...`);
        const articlesInCluster = await getClusters(cluster);
        for (const article of articlesInCluster) {
            const requestParam: SearchArticleRequest = { ...article, ...cluster };
            await requestArticles(requestParam);
        }
    }
}

export async function requestArticles(requestParam: SearchArticleRequest): Promise<void> {
    const rooms: Room[] = await getArticleList(requestParam);
    await writeDocumentsForRooms(rooms);
    // 상세 파싱
    const details = await Promise.allSettled(
        rooms.map(async (room) => {
            const articles = await getDetail(room.atclNo);
            await writeDocumentsForRoomDetail(room.atclNo, articles);
        })
    );
    console.log(details.filter(({ status }) => status === 'fulfilled'));
}

export async function getTodayNewRooms(currentDate: Date, roomFilterFunction: Function, hoursAgo: number = 1) {
    const newRooms = Array.prototype.slice.call(await getNewRooms(currentDate, hoursAgo)) as Room[];
    return newRooms.filter((room) => roomFilterFunction(room));
}

export async function getTodayDeletedRooms(currentDate: Date, roomFilterFunction: Function, hoursAgo: number = 1) {
    const deletedRooms = Array.prototype.slice.call(await getDeletedRooms(currentDate, hoursAgo)) as Room[];
    return deletedRooms.filter((room) => roomFilterFunction(room));
}

const col: { [key: string]: string } = {
    name: '이름',
    price: '보증금',
    alpha: '관리비',
    address: '주소',
    type: '유형',
    area: '공급/전용면적',
    floor: '층',
    moveInDate: '입주가능일',
    officeName: '업체명',
    tel: '연락처',
    created: '등록일(추정)',
    updated: '갱신일(추정)',
    url: '링크',
};

function getMessageRooms(rooms: Room[]): MessageRoom[] {
    return rooms.map((room): { [key: string]: string | Date | undefined } => ({
        address: room.myhomeRoomDetail?.address || '주소 없음',
        type: room.rletTpNm,
        area: room.myhomeRoomDetail?.property['공급/전용면적'] || '',
        name: room.atclNm,
        price: room.prc / 10000 + '억',
        moveInDate: room.myhomeRoomDetail?.property['입주가능일'] || '',
        alpha: room.myhomeRoomDetail?.property['관리비'] || '',
        floor: room.flrInfo,
        officeName: room.myhomeRoomDetail?.office?.name || '',
        tel: ['', ...(room.myhomeRoomDetail?.office?.tel || [])].join('\n'),
        url: `${NAVER_ARTICLE_DETAIL_URL}/${room.atclNo}`,
        created: getKoreaTimezoneString(room.createdAt),
        updated: getKoreaTimezoneString(room.updatedAt),
    })) as MessageRoom[];
}

function isValidMessageRooms(room: MessageRoom, key: string): boolean {
    return !(
        (
            !room[key] || // Valid check
            (key === 'updated' && room['updated']?.toString() === room['created']?.toString())
        ) // 등록일과 수정일이 같은 경우 등록일만 보여주기
    );
}

export async function sendNewRoomTelegramMessage(rooms: Room[], chatId: string, type: 'new' | 'deleted' = 'new') {
    // 메시지 만들기
    const messageRooms: MessageRoom[] = getMessageRooms(rooms);
    const length = messageRooms.length;
    let cnt = 0;
    for (const room of messageRooms) {
        const message = Object.keys(col).reduce((result, key) => {
            return isValidMessageRooms(room, key) ? [...result, `${col[key]}: ${room[key]}`] : [...result];
        }, [] as string[]);

        await sendMessage(chatId, message.join('\n'));
        console.log(`🏠 매물 ${++cnt}/${length} 건 메시지 전송 완료`);
        if (cnt % 10 === 0) {
            sleep(200000);
        }
    }
    const resultMessage = length
        ? `🏠 매물 ${length}건이 새로 등록되었어요. 위로 올려 한번 확인해보세요`
        : `🥲 아직 새롭게 올라온 매물이 없었어요`;
    await sendMessage(chatId, resultMessage);
}

export async function sendDeletedRoomTelegramMessage(rooms: Room[], chatId: string) {
    // 메시지 만들기
    const messageRooms: MessageRoom[] = getMessageRooms(rooms);
    const length = messageRooms.length;
    let cnt = 0;

    for (const room of messageRooms) {
        const message = Object.keys(col).reduce((result, key) => {
            return isValidMessageRooms(room, key) && !['url'].includes(key)
                ? [...result, `${col[key]}: ${room[key]}`]
                : [...result];
        }, [] as string[]);
        const getTime = (date: Date | undefined) => getUTCDate(date || new Date(0)).getTime();
        const [deleted, created] = [getTime(room.deletedAt as Date), getTime(room.createdAt as Date)];
        const diff = deleted - created;
        const diffDays = Math.floor(diff / (86400 * 1000)) + 1;
        if (deleted !== 0 && created !== 0) {
            const prefix = diffDays === 1 ? '하루 만에' : `${diffDays}일 만에`;
            message.push(`⌛ ${prefix} 나갔습니다`);
        }
        message.unshift('❌😵 오늘 내가 놓친 매물');
        await sendMessage(chatId, message.join('\n'));
        console.log(`❌ 유효하지 않은 매물 ${++cnt}/${length} 건 메시지 전송 완료`);
    }
    if (length) {
        await sendMessage(chatId, `🥲 아쉽게 놓친 매물 ${length}건을 찾았어요.\n매물 회전율을 살펴볼까요?`);
    }
}

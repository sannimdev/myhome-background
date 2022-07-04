import { Room, SearchArticleRequest, SearchClusterList } from '../type/land';
import { getDeletedRooms, getNewRooms, getRoom, getRooms, overwriteRooms } from '../lib/mongo';
import { getArticleDetail, getClusters } from '../lib/land';
import { getDetail } from '../service/article';
import { writeDocumentsForRoomDetail } from '../service/article';
import { writeDocumentsForRooms } from '../service/article';
import { getArticleList } from '../service/article';
import { NAVER_ARTICLE_DETAIL_URL } from '../util/config';
import { sendMessage } from '../lib/telegram';

export async function cleanUpInvalidArticles(): Promise<void> {
    const rooms = ((await getRooms()) as Room[]).filter((room) => !room?.deletedAt);
    console.log(
        rooms.length,
        rooms.map((room) => room.atclNo)
    );
    const invalidRooms = [];
    for (const room of rooms) {
        const response = await getArticleDetail(room.atclNo);
        if (response.indexOf('요청하신 페이지를 찾을 수 없습니다.</strong>') !== -1) {
            invalidRooms.push(room);
        }
    }
    await overwriteRooms(invalidRooms.map((room) => ({ ...room, deletedAt: new Date() })) as Room[]);
    console.log('✂️ 유효하지 않은 방 정보', invalidRooms.length, '개 정리 완료');
    console.log('===============================================');
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

export async function getTodayNewRooms(currentDate: Date) {
    const newRooms = Array.prototype.slice.call(await getNewRooms(currentDate)) as Room[];
    return newRooms.filter((room) => getRoomFilterFunction(room));
}

export async function sendNewRoomTelegramMessage(rooms: Room[]) {
    console.log('🚀 결과를 텔레그램으로 전송하려고 합니다.');
    // 메시지 만들기
    const col: { [key: string]: string } = {
        name: '이름',
        price: '보증금',
        alpha: '관리비',
        address: '주소',
        type: '유형',
        floor: '층',
        moveInDate: '입주가능날짜',
        url: '링크',
        created: '등록일(추정)',
        updated: '내용수정일(추정)',
    };
    const messageRooms = rooms.map((room): { [key: string]: string | Date | undefined } => ({
        address: room.myhomeRoomDetail?.address || '주소 없음',
        type: room.rletTpNm,
        name: room.atclNm,
        price: room.prc / 10000 + '억',
        moveInDate: room.myhomeRoomDetail?.property['입주가능날짜'] || '',
        alpha: room.myhomeRoomDetail?.property['관리비'] || '',
        floor: room.flrInfo,
        url: `${NAVER_ARTICLE_DETAIL_URL}/${room.atclNo}`,
        created: room.createdAt?.toLocaleString(),
        updated: room.updatedAt?.toLocaleString(),
    }));
    const length = messageRooms.length;
    let cnt = 0;
    for (const room of messageRooms) {
        const message = Object.keys(col).reduce((result, key) => {
            return [...result, `${col[key]}: ${room[key]}`];
        }, [] as string[]);
        await sendMessage(message.join('\n'));
        console.log(`🏠 매물 ${++cnt}/${length} 건 메시지 전송 완료`);
    }
    const resultMessage = length
        ? `🏠 매물 ${length}건이 새로 등록되었어요. 위로 올려 한번 확인해보세요`
        : `🥲 아직 새롭게 올라온 매물이 없었어요`;
    await sendMessage(resultMessage);
}

export async function getTodayDeletedRooms(currentDate: Date) {
    const deletedRooms = Array.prototype.slice.call(await getDeletedRooms(currentDate)) as Room[];
    return deletedRooms.filter((room) => getRoomFilterFunction(room));
}

export async function sendDeletedRoomTelegramMessage(rooms: Room[]) {
    console.log('😟 오늘 공고에서 내려간 매물을 찾고 있습니다');
    // 메시지 만들기
    const col: { [key: string]: string } = {
        no: '매물번호',
        address: '주소',
        name: '이름',
        type: '유형',
        floor: '층',
        price: '보증금',
        alpha: '관리비',
        moveInDate: '입주가능날짜',
        created: '등록일(추정)',
        deleted: '삭제일(추정)',
    };
    const messageRooms = rooms.map((room): { [key: string]: string | Date | undefined } => ({
        address: room.myhomeRoomDetail?.address || '주소 없음',
        no: room.atclNo,
        name: room.atclNm,
        type: room.rletTpNm,
        floor: room.flrInfo,
        price: room.prc / 10000 + '억',
        alpha: room.myhomeRoomDetail?.property['관리비'] || '',
        moveInDate: room.myhomeRoomDetail?.property['입주가능날짜'] || '',
        createdAt: room.createdAt,
        deletedAt: room.deletedAt,
        created: room.createdAt?.toLocaleString(),
        deleted: room.deletedAt?.toLocaleString(),
    }));
    const length = messageRooms.length;
    let cnt = 0;
    for (const room of messageRooms) {
        const message = Object.keys(col).reduce((result, key) => {
            return room[key] ? [...result, `${col[key]}: ${room[key]}`] : [...result];
        }, [] as string[]);
        const getTime = (date: Date | undefined) => new Date(date || 0).getTime();
        const [deleted, created] = [getTime(room.deletedAt as Date), getTime(room.createdAt as Date)];
        const diff = deleted - created;
        const diffDays = Math.floor(diff / (86400 * 1000));
        if (deleted !== 0 && created !== 0) {
            const prefix = diffDays === 0 ? '당일에' : `${diffDays}일 만에`;
            message.push(`⌛ ${prefix} 나갔습니다`);
        }
        message.unshift('❌😵 오늘 내가 놓친 매물');
        await sendMessage(message.join('\n'));
        console.log(`❌ 유효하지 않은 매물 ${++cnt}/${length} 건 메시지 전송 완료`);
    }
    if (length) {
        await sendMessage(`🥲 아쉽게 놓친 매물 ${length}건을 찾았어요. 매물 회전율을 살펴볼까요?`);
    }
}

function getRoomFilterFunction(room: Room) {
    return (
        room.prc <= 20000 &&
        room.myhomeRoomDetail?.address?.startsWith('경기도 성남시') &&
        (room.tagList.includes('융자금적은') || room.tagList.includes('융자금없는')) &&
        !room.flrInfo.startsWith('B1/') &&
        room.tradTpCd === 'B1'
    );
}

import { Room, SearchArticleRequest, SearchClusterList } from '../type/land';
import { getNewRooms, getRooms, overwriteRooms } from '../lib/mongo';
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

export async function getTodayNewRooms() {
    const newRooms = Array.prototype.slice.call(await getNewRooms()) as Room[];
    return newRooms.filter(
        (room) =>
            room.prc <= 20000 &&
            room.myhomeRoomDetail?.address?.startsWith('경기도 성남시') &&
            (room.tagList.includes('융자금적은') || room.tagList.includes('융자금없는')) &&
            !room.flrInfo.startsWith('B1/') &&
            room.tradTpCd === 'B1'
    );
}

export async function sendTelegramMessage(rooms: Room[]) {
    console.log('🚀 결과를 텔레그램으로 전송하려고 합니다.');
    // 메시지 만들기
    const col: { [key: string]: string } = {
        url: '링크',
        address: '주소',
        name: '이름',
        type: '유형',
        floor: '층',
        price: '가격',
    };
    const messageRooms = rooms.map((room): { [key: string]: string } => ({
        url: `${NAVER_ARTICLE_DETAIL_URL}/${room.atclNo}`,
        address: room.myhomeRoomDetail?.address || '주소 없음',
        name: room.atclNm,
        type: room.rletTpNm,
        floor: room.flrInfo,
        price: room.prc / 10000 + '억',
    }));
    const length = messageRooms.length;
    let cnt = 0;
    for (const room of messageRooms) {
        const message = Object.keys(room).reduce((result, key) => {
            return [...result, `${col[key]}: ${room[key]}`];
        }, [] as string[]);
        await sendMessage(message.join('\n'));
        console.log(`🏠 매물 ${++cnt}/${length} 건 메시지 전송 완료`);
    }
    length && (await sendMessage(`🏠 매물 ${length}건이 새로 등록되었어요. 위로 올려 한번 확인해보세요`));
}

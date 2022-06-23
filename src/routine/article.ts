import { Room, SearchArticleRequest, SearchClusterList } from '../type/land';
import { getRooms, overwriteRooms } from '../lib/mongo';
import { getArticleDetail, getClusters } from '../lib/land';
import { getDetail } from '../service/article';
import { writeDocumentsForRoomDetail } from '../service/article';
import { writeDocumentsForRooms } from '../service/article';
import { getArticleList } from '../service/article';

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

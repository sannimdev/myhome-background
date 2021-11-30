import { IS_LOCAL_MACHINE } from './lib/environment';
import { saveFile } from './lib/file';
import { getArticleDetail, getArticles } from './lib/land';
import { addDocument } from './lib/mongo';
import { Room, SearchArticleRequest } from './type/land';

export async function getArticleList(
    requestParam: SearchArticleRequest,
    maxPage = Number.MAX_SAFE_INTEGER
) {
    try {
        const rooms: Room[] = [];
        let page = 1;
        while (page <= maxPage) {
            const room = await getArticles(requestParam, page);
            Object.assign(rooms, [...rooms, ...room]);
            page += 1;
            if (room.length === 20) {
                console.log(
                    `🚚 매물 목록 중 ${
                        page - 1
                    }페이지 수집을 종료하고 다음 ${page}페이지 정보를 수집합니다`
                );
            } else {
                console.log('🚧 매물 목록 수집을 종료합니다...');
                break;
            }
        }
        return rooms;
    } catch (e) {
        console.error('getArticleList', e);
        return [];
    }
}

export async function writeDocumentsForRooms(rooms: Room[]) {
    IS_LOCAL_MACHINE
        ? await saveFile(`article-list-${Date.now()}.json`, JSON.stringify(rooms, null, 4))
        : await addDocument(`room`, rooms);
}

export async function getDetail(articleNo: number | string) {
    try {
        return await getArticleDetail(articleNo);
    } catch (e) {
        console.error('getArticleDetail', e);
        return e + '';
    }
}

export async function writeDocumentsForRoomDetail(articleNo: number | string, content: string) {
    IS_LOCAL_MACHINE && (await saveFile(`article-detail-${articleNo}-${Date.now()}.json`, content));
}

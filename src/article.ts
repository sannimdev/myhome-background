import { parse, HTMLElement } from 'node-html-parser';
import { IS_LOCAL_MACHINE } from './lib/environment';
import { saveFile } from './lib/file';
import { getArticleDetail, getArticleDetailImages, getArticles } from './lib/land';
import { addDocument, overwriteRoom, overwriteRooms } from './lib/mongo';
import { Room, RoomDetail, SearchArticleRequest } from './type/land';

async function sleep(ms: number = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getArticleList(requestParam: SearchArticleRequest, maxPage = Number.MAX_SAFE_INTEGER) {
    try {
        const rooms: Room[] = [];
        let page = 1;
        while (page <= maxPage) {
            const room = await getArticles(requestParam, page);
            Object.assign(rooms, [...rooms, ...room]);
            page += 1;
            if (room.length === 20) {
                console.log(`🚚 매물 목록 중 ${page - 1}페이지 수집을 종료하고 다음 ${page}페이지 정보를 수집합니다`);
                await sleep(1000);
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
    if (IS_LOCAL_MACHINE) {
        await saveFile(`article-list-${Date.now()}.json`, JSON.stringify(rooms, null, 4));
        return;
    }
    await addDocument('daily', rooms);
    await overwriteRooms(rooms);
}

export async function getDetail(articleNo: number | string) {
    try {
        return await getArticleDetail(articleNo);
    } catch (e) {
        console.error('getDetail', e);
        return e + '';
    }
}

export async function getDetailImages(articleNo: number | string): Promise<string[]> {
    try {
        const response = await getArticleDetailImages(articleNo);
        const dom = parse(response);
        const nodes = dom.querySelectorAll('li.photo_list_item > div > a');
        const styles = nodes.map((node) => node.getAttribute('style'));
        return styles.map((style) => style?.substring(style.search(/https\:\/\//), style.search(/\)$/)) || '');
    } catch (e) {
        console.error('getDetailImages', e);
        return [];
    }
}

export async function writeDocumentsForRoomDetail(articleNo: number | string, content: string): Promise<boolean> {
    try {
        const dom = parse(content);
        // 1. 매물 정보
        const details = dom.querySelectorAll('.detail_row_cell');
        const property: { [key: string]: string } = {};
        for (const node of details) {
            const key = node.querySelector('.detail_cell_title')?.innerText || '';
            const value = node.querySelector('.detail_cell_data')?.innerText || '';
            if (key) property[key] = value;
        }
        // 2. 방 내부 시설
        const getInnerText = (nodes: HTMLElement[]) => nodes.map((node) => node.innerText || '').filter((s) => !!s);
        const facilitiesNodes = dom.querySelectorAll('.detail_facilities_list');
        const roomFacilities = facilitiesNodes[0].querySelectorAll('.detail_info_title');
        const room = getInnerText(roomFacilities);
        // 3. 보안/생활시설
        const securityFacilities = facilitiesNodes[1].querySelectorAll('.detail_info_title');
        const security = getInnerText(securityFacilities);

        const result = {
            property,
            facility: {
                room,
                security,
            },
        };

        console.log('🔍 매물 상세 정보 파싱');
        console.log(result);

        IS_LOCAL_MACHINE
            ? await saveFile(`article-detail-${articleNo}-${Date.now()}.json`, JSON.stringify(result, null, 3))
            : await overwriteRoom(articleNo, result);

        return true;
    } catch (e) {
        console.error('writeDocumentsForRoomDetail', e);
        throw e;
    }
}

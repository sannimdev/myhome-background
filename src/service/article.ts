import { parse, HTMLElement } from 'node-html-parser';
import { sleep } from '../lib/common';
import { IS_LOCAL_MACHINE } from '../data/environment';
import { saveFile } from '../lib/file';
import { getArticleDetail, getArticleDetailImages, getArticles } from '../lib/land';
import { addDocuments, overwriteRooms, updateMyHomeRoomDetail } from '../lib/mongo';
import { Room, RoomDetail, SearchArticleRequest } from '../type/land';

export async function getArticleList(requestParam: SearchArticleRequest, maxPage = Number.MAX_SAFE_INTEGER) {
    try {
        const rooms: Room[] = [];
        let page = 1;
        while (page <= maxPage) {
            const room = await getArticles(requestParam, page);
            Object.assign(rooms, [...rooms, ...room]);
            page += 1;
            if (room.length === 20) {
                console.log(`    🚚 매물 목록 중 ${page - 1}페이지 수집을 종료. ${page}페이지 정보를 수집합니다`);
                await sleep(Math.round(Math.random() * 1000 + 500));
            } else {
                console.log(`    🚧 ${requestParam.cortarNo} 매물 목록 수집을 종료합니다...`);
                break;
            }
        }
        return rooms;
    } catch (e) {
        console.error('getArticleList', e);
        throw e;
    }
}

export async function writeDocumentsForRooms(rooms: Room[]) {
    if (IS_LOCAL_MACHINE) {
        await saveFile(`article-list-${Date.now()}.json`, JSON.stringify(rooms, null, 4));
    } else {
        await addDocuments('daily', rooms);
        await overwriteRooms(rooms);
    }
}

export async function getDetail(articleNo: number | string) {
    try {
        return await getArticleDetail(articleNo);
    } catch (e) {
        console.error('getDetail', e);
        throw e;
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
        throw e;
    }
}

export async function writeDocumentsForRoomDetail(articleNo: number | string, content: string): Promise<boolean> {
    try {
        console.log(`        🔍 ${articleNo}번 매물 상세 정보를 파싱합니다`);
        const result: RoomDetail = {
            property: {},
            facility: {},
            images: [],
        };
        const dom = parse(content);

        // 1. 매물 정보
        const details = dom.querySelectorAll('.detail_row_cell');
        const property: { [key: string]: string } = {};
        console.log(`        🧱 ${details.length}개 매물 속성 파싱하기`);
        for (const node of details) {
            const key = node.querySelector('.detail_cell_title')?.innerText || '';
            const value = node.querySelector('.detail_cell_data')?.innerText || '';
            if (key) property[key] = value;
        }
        result.property = property;

        // 2. 방 내부 시설
        const getInnerText = (nodes: HTMLElement[]): string[] =>
            nodes.map((node) => node.innerText || '').filter((s) => !!s);
        const facilitiesNodes = dom.querySelectorAll('.detail_facilities');

        if (facilitiesNodes.length) {
            const facilities: { [key: string]: string } = {
                '방 내부시설': 'room',
                '보안/생활시설': 'security',
                '주변 편의시설/1km 이내': 'neighborhood',
            };
            facilitiesNodes.forEach((facility) => {
                const title = facility.querySelector('.detail_head_title')?.innerText;
                if (title) {
                    const key = facilities[title] || title;
                    result.facility[key] = getInnerText(facility.querySelectorAll('.detail_info_title'));
                    !IS_LOCAL_MACHINE && console.log(result.facility);
                }
            });
        }

        // 3. 이미지 파싱
        result.images = await getDetailImages(articleNo);
        console.log('    ', JSON.stringify(result.images, null, 3));

        // 4. 주소
        result.address = dom.querySelector('em.detail_info_branch')?.innerText.trim();

        IS_LOCAL_MACHINE
            ? await saveFile(`article-detail-${articleNo}-${Date.now()}.json`, JSON.stringify(result, null, 3))
            : await updateMyHomeRoomDetail(articleNo, result);

        return true;
    } catch (e) {
        console.error('writeDocumentsForRoomDetail', e);
        throw e;
    }
}

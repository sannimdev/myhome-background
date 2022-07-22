import { parse, HTMLElement } from 'node-html-parser';
import { sleep } from '../lib/common';
import { IS_LOCAL_MACHINE } from '../data/environment';
import { saveFile } from '../lib/file';
import {
    getArticleDetail,
    getArticleDetailImages,
    getArticleInitialRealTransactionPrice,
    getArticles,
} from '../lib/land';
import { addDocuments, overwriteRooms, updateMyHomeRoomDetail } from '../lib/mongo';
import { Room, RoomDetail, RoomOffice, SearchArticleRequest } from '../type/land';
import { ArticleDetail } from '../data/article';
import { createNoSubstitutionTemplateLiteral } from 'typescript';

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
                await sleep(Math.round(Math.random() * 1800));
            } else {
                console.log(`    🚧 매물 목록 수집을 종료합니다...`);
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
            office: {},
        };
        const dom = parse(content);

        // 1. 매물 정보
        const details = dom.querySelectorAll('.detail_row_cell');
        const property: { [key: string]: string } = {};
        console.log(`        🧱 ${details.length}개 매물 속성 파싱하기`);
        for (const node of details) {
            const key = node.querySelector('.detail_cell_title')?.innerText || '';
            const value = node.querySelector('.detail_cell_data')?.innerText || '';
            const description = dom.querySelector('.detail_description_text')?.innerText || '';
            if (key) property[key] = value || description;
        }
        result.property = property;

        // 2. 부동산 업체 정보
        const office: RoomOffice = {
            name: dom.querySelector('.detail_agent_head .detail_head_title')?.text,
            tel:
                Array.from(dom.querySelectorAll('.detail_data_link.type_tel'))
                    .map((el) => el.innerText)
                    .filter((el) => /[0-9\-]+/.test(el)) || [],
        };
        console.log(
            '📱 공인중개사 전화번호',
            Array.from(dom.querySelectorAll('.detail_data_link.type_tel')).map((el) => el.text)
        );
        result.office = office;

        // 3. 방 내부 시설
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

        // 4.  이미지 파싱
        result.images = await getDetailImages(articleNo);
        console.log('    ', JSON.stringify(result.images, null, 3));

        // 5. 주소
        result.address = dom.querySelector('em.detail_info_branch')?.innerText.trim();

        // 6. 전세가율 파싱
        let ratioText = dom
            .querySelector('.detail_data_applicable .detail_applicable_percentage .detail_percentage_price')
            ?.innerText?.trim();

        // 네이버부동산에서 전세가율을 찾을 수 없으면 최신 거래가를 기준으로 파싱 시도하기
        if (!ratioText) {
            const articleDetail = parseArticleJson(content);
            const hscpNo = articleDetail?.state?.article?.article?.hscpNo; // 건물 번호
            const ptpNo = articleDetail?.state?.article?.article?.ptpNo; // 건물 내 단지 번호
            if (hscpNo && ptpNo) {
                const result = await getArticleInitialRealTransactionPrice(hscpNo, ptpNo);
                const dealPrice = result?.dealTransactionPrice?.realTransactionPriceList[0]?.dealPrice;
                const warrantPrice = articleDetail?.state?.article?.price?.warrantPrice;

                if (dealPrice && warrantPrice) {
                    ratioText = Math.round((warrantPrice / dealPrice) * 100) + '';
                }
            }
            result.isCustomApplicablePercentage = true;
        }

        result.applicablePercentage = ratioText || undefined;

        // IS_LOCAL_MACHINE ? await saveFile(`article-detail-${articleNo}-${Date.now()}.json`, JSON.stringify(result, null, 3)): await updateMyHomeRoomDetail(articleNo, result);
        await updateMyHomeRoomDetail(articleNo, result);

        return true;
    } catch (e) {
        console.error('writeDocumentsForRoomDetail', e);
        throw e;
    }
}

const START_APP = '<script>window.App=';
const END_APP = '</script>';
function parseArticleJson(response: string): ArticleDetail | null {
    try {
        const content = response.split(START_APP)[1];
        return JSON.parse(content.split(END_APP)[0]) as ArticleDetail;
    } catch (e) {
        console.error(e);
        return null;
    }
}

import axios, { Axios, AxiosInstance, AxiosResponse } from 'axios';
import {
    requestParamForComplex,
    requestParamForOneTwoRoom,
    requestParamForVilla,
} from './data/request';
import { ArticleResponse, Room, SearchArticleRequest, SearchRequest } from './type/land';
import {
    COMPLEX_BASE_URL,
    VILLA_BASE_URL,
    USER_AGENT_CHROME,
    ONE_TWO_ROOM_BASE_URL,
} from './util/config';

const headers = { 'User-Agent': USER_AGENT_CHROME };
export async function getLand(url: string, params: SearchRequest) {
    try {
        const response: AxiosResponse<Room[]> = await axios.get(url, { params, headers });
        return response.data.map((item) => ({ ...item, createdAt: new Date() }));
    } catch (e) {
        throw e;
    }
}

export async function getArticle(url: string, params: SearchArticleRequest) {
    try {
        const response: AxiosResponse<ArticleResponse> = await axios.get(url, { params, headers });
        console.log(response.data);
        return response.data;
    } catch (e) {
        throw e;
    }
}

// export async function getNaverLandToken(instance: AxiosInstance): Promise<string> {
//     try {
//         const response = await instance.get(NAVER_LAND_URL);
//         const html = String(response.data).replace(/ /gi, '');
//         const token = `"token":{"token":"`;
//         const tokenStart = html.search(new RegExp(token)) + token.length;
//         const tokenEnd = tokenStart + html.substring(tokenStart).indexOf(`"`);
//         return html.substring(tokenStart, tokenEnd);
//     } catch (e) {
//         console.error('getNaverLandToken', e);
//         throw new Error('Token Eror');
//     }
// }

export async function testComplex() {
    try {
        return getLand(COMPLEX_BASE_URL, requestParamForComplex);
    } catch (e) {
        console.error('testLand:', e);
    }
}

export async function testVilla() {
    try {
        return getLand(VILLA_BASE_URL, requestParamForVilla);
    } catch (e) {
        console.error('testVilla', e);
    }
}

export async function testOneTwoRoom() {
    try {
        return getArticle(ONE_TWO_ROOM_BASE_URL, requestParamForOneTwoRoom);
    } catch (e) {
        console.error('testOneTwoRoom', e);
    }
}

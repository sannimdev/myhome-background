import axios, { AxiosResponse } from 'axios';
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
    NAVER_LAND_URL,
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

export async function getArticle(url: string, params: SearchArticleRequest, token: string) {
    try {
        const reqHeaders = { ...headers, authorization: `Bearer ${token}` };
        const response: AxiosResponse<ArticleResponse> = await axios.get(url, {
            params,
            headers: reqHeaders,
        });
        const articleList = response.data.articleList || [];
        return articleList.map((article) => ({ ...article, createdAt: new Date() }));
    } catch (e) {
        throw e;
    }
}

export async function getNaverLandToken(): Promise<string> {
    try {
        const response = await axios.get(NAVER_LAND_URL);
        const html = String(response.data).replace(/ /gi, '');
        const token = `"token":{"token":"`;
        const tokenStart = html.search(new RegExp(token)) + token.length;
        const tokenEnd = tokenStart + html.substring(tokenStart).indexOf(`"`);
        return html.substring(tokenStart, tokenEnd);
    } catch (e) {
        console.error('getNaverLandToken', e);
        throw new Error('Token Eror');
    }
}

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

export async function testOneTwoRoom(token: string) {
    try {
        if (!token)
            throw new Error(
                'Please input your token from your function to testOneTwoRoom function'
            );
        return getArticle(ONE_TWO_ROOM_BASE_URL, requestParamForOneTwoRoom, token);
    } catch (e) {
        console.error('testOneTwoRoom', e);
    }
}

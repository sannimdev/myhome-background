import axios, { AxiosResponse } from 'axios';
import { ArticleResponse, Room, SearchArticleRequest, SearchClusterList } from '../type/land';
import {
    getArticleDetailUrl,
    NAVER_ARTICLE_LIST_URL,
    NAVER_CLUSTER_LIST_URL,
    USER_AGENT_CHROME,
} from '../util/config';

const headers = { 'User-Agent': USER_AGENT_CHROME };

export async function getArticles(params: SearchArticleRequest, page = 1): Promise<Room[]> {
    try {
        const response: AxiosResponse<ArticleResponse> = await axios.get(NAVER_ARTICLE_LIST_URL, {
            params: { ...params, page },
            headers,
        });
        const rooms: Room[] = response.data.body || [];
        return rooms.map((room) => ({ ...room, createdAt: new Date() }));
    } catch (e) {
        throw e;
    }
}

export async function getArticleDetail(articleNo: number | string) {
    try {
        const articleDetailUrl = getArticleDetailUrl(articleNo);
        const response: AxiosResponse<string> = await axios.get(articleDetailUrl);
        return response.data;
    } catch (e) {
        throw e;
    }
}

export async function getClusters(params: SearchClusterList) {
    try {
        const response = await axios.get(NAVER_CLUSTER_LIST_URL, {
            params,
            headers,
        });
        console.log(response.data);
        return response.data;
    } catch (e) {
        throw e;
    }
}

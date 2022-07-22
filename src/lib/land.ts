import axios, { AxiosResponse } from 'axios';
import { encode } from 'punycode';
import { TransactionPriceResponse } from '../data/transactionPrice';
import { ArticleInClusterList, ArticleResponse, Room, SearchArticleRequest, SearchClusterList } from '../type/land';
import {
    getArticleDetailUrl,
    NAVER_ARTICLE_LIST_URL,
    NAVER_CLUSTER_LIST_URL,
    USER_AGENT_CHROME,
} from '../util/naverland';
import { getUTCDate } from './date';

const headers = { 'User-Agent': USER_AGENT_CHROME };

export async function getArticles(params: SearchArticleRequest, page = 1): Promise<Room[]> {
    try {
        const response: AxiosResponse<ArticleResponse> = await axios.get(NAVER_ARTICLE_LIST_URL, {
            params: { ...params, page },
            headers,
        });
        const rooms: Room[] = response.data.body || [];
        return rooms.map((room) => ({ ...room, createdAt: getUTCDate() }));
    } catch (e) {
        throw e;
    }
}

export async function getArticleDetail(articleNo: number | string) {
    try {
        const articleDetailUrl = getArticleDetailUrl(articleNo);
        const response: AxiosResponse<string> = await axios.get(articleDetailUrl, {
            headers: {
                ...headers,
                Referer: 'https://m.land.naver.com/',
                'sec-ch-ua': `" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"`,
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': 'Windows',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Dest': 'iframe',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'ko,en-US;q=0.9,en;q=0.8,ru;q=0.7,ja;q=0.6,zh-CN;q=0.5,zh;q=0.4,zh-TW;q=0.3',
                dnt: '1',
                'sec-gpc': '1',
            },
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

export async function getArticleDetailImages(articleNo: number | string) {
    try {
        const url = `https://m.land.naver.com/article/image/${articleNo}`;
        const response = await axios.get(url, {
            headers,
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

export async function getArticleInitialRealTransactionPrice(
    hscpNo: number | string,
    ptpNo: number | string
): Promise<TransactionPriceResponse> {
    try {
        const params: { [key: string]: string } = { hscpNo: String(hscpNo), ptpNo: String(ptpNo) };
        const keys = Object.keys(params);
        const querystrings = [];
        for (const key of keys) {
            if (!params[key]) continue;
            querystrings.push(`${key}=${params[key]}`);
        }
        const querystring = querystrings.join('&');
        const url = `https://m.land.naver.com/mobile/api/mobile/articles/initial-real-transaction-price?${querystring}`;
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (e) {
        throw e;
    }
}

export async function getClusters(params: SearchClusterList): Promise<ArticleInClusterList[]> {
    try {
        const response = await axios.get(NAVER_CLUSTER_LIST_URL, {
            params,
            headers,
        });
        return (response.data?.data?.ARTICLE as ArticleInClusterList[]) || [];
    } catch (e) {
        throw e;
    }
}

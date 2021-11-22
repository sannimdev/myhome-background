import axios, { AxiosResponse } from 'axios';
import { requestParamForComplex, requestParamForVilla } from './data/request';
import { Room, SearchRequest } from './type/land';
import { COMPLEX_BASE_URL, VILLA_BASE_URL, USER_AGENT_CHROME } from './util/config';

const headers = { 'User-Agent': USER_AGENT_CHROME };
export async function getLand(url: string, params: SearchRequest) {
    try {
        const response: AxiosResponse<Room[]> = await axios.get(url, { params, headers });
        return response.data.map((item) => ({ ...item, createdAt: new Date() }));
    } catch (e) {
        throw e;
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

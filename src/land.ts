import axios, { AxiosResponse } from 'axios';
import { requestParam } from './data/request';
import { Room, SearchRequest } from './type/land';
import { BASE_URL, USER_AGENT_CHROME } from './util/config';

const instance = axios.create({
    baseURL: BASE_URL,
    headers: { 'User-Agent': USER_AGENT_CHROME },
});

export async function testLand() {
    try {
        const response: AxiosResponse<Room[]> = await instance.get('', { params: requestParam });
        return response.data.map((item) => ({ ...item, createdAt: new Date() }));
    } catch (e) {
        console.error('testLand:', e);
    }
}

import axios from 'axios';
import { USER_AGENT_CHROME } from './configs';

const instance = axios.create({
    baseURL: 'https://www.whatismybrowser.com/detect/what-is-my-user-agent',
    headers: { 'User-Agent': USER_AGENT_CHROME },
});

export async function getMyUserAgent() {
    try {
        const response = await instance.get('/');
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

import axios from 'axios';

// const baseURL = 'https://new.land.naver.com/api/complexes/single-markers/2.0';
const USER_AGENT_CHROME =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36';
const instance = axios.create({
    baseURL: 'https://www.whatismybrowser.com/detect/what-is-my-user-agent',
    headers: { 'User-Agent': USER_AGENT_CHROME },
});

async function run() {
    try {
        const response = await instance.get('/');
        console.log(response.data);
    } catch (e) {
        console.error(e);
    }
}

run();

import { getMyUserAgent } from './utils/userAgent';

async function run() {
    const data = await getMyUserAgent();
    console.log(data);
}

run();

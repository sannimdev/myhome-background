import { requestClusterList } from './data/request';
import { IS_LOCAL_MACHINE } from './lib/environment';
import { openMongo, closeMongo, getNewRooms } from './lib/mongo';
import { sendMessage } from './lib/telegram';
import { cleanUpInvalidArticles, getTodayNewRooms, requestClusters, sendTelegramMessage } from './routine/article';
import { getDetail } from './service/article';
import { Room } from './type/land';

run();

async function run() {
    try {
        await openMongo();

        // await runOnLocalMachine();
        await runOnProduction();
    } catch (e) {
        console.error('run()', e);
    } finally {
        //////////////////////////////// 프로세스 종료 명시적으로 해야 종료됨.
        await closeMongo();
        process.exit();
    }
}

async function runOnProduction() {
    // 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢 정규 루틴 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢
    // 1. 유효하지 않은 매물 삭제하기
    await cleanUpInvalidArticles();

    // 2. 매물 목록 파싱하여 등록하기
    await requestClusters(requestClusterList);

    // 3. 오늘 올라온 매물 가져오기
    const newRooms = await getTodayNewRooms();

    // 4. 텔레그램 메시지 보내기
    await sendTelegramMessage(newRooms);
}

async function runOnLocalMachine() {
    const newRooms = await getTodayNewRooms();
    await sendTelegramMessage(newRooms);

    // ✂️ 필요한 부분만 빨리 로컬머신에서 돌릴 때\
    // const response = await getDetail(no);
    // const images = await getDetailImages(no);
    // console.log('🚚', images);
    // const rooms = (await getRooms()) as Room[];
    // console.log(response);
    // 매물 정보 파싱
    // for (const cluster of requestClusterList) {
    //     const articles = await getClusters(cluster);
    //     for (const article of articles) {
    //         const searchArticleRequest: SearchArticleRequest = {
    //             ...article,
    //             ...cluster,
    //         };
    //         await requestArticles(searchArticleRequest);
    //     }
    // }
}

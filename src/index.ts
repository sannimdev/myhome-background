import { requestClusterList, requestParamSample3 } from './data/request';
import { openMongo, closeMongo, getNewRooms } from './lib/mongo';
import { sendMessage } from './lib/telegram';
import { cleanUpInvalidArticles, getTodayNewRooms, requestClusters, sendTelegramMessage } from './routine/article';
import { getDetail, writeDocumentsForRoomDetail, getArticleList } from './service/article';
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
    try {
        const startTime = new Date();
        await sendMessage('⛹️‍♂️ 지금 매물을 탐색하고 있어요');

        // 1. 유효하지 않은 매물 삭제하기
        await cleanUpInvalidArticles();

        // 2. 매물 목록 파싱하여 등록하기
        await requestClusters(requestClusterList);

        // 3. 오늘 올라온 매물 가져오기
        const newRooms = await getTodayNewRooms(startTime);

        // 4. 텔레그램 메시지 보내기
        await sendTelegramMessage(newRooms);
    } catch (error) {
        console.error(error);
        console.error('오류가 발생되어 중단되었어요.');
    }
}

async function runOnLocalMachine() {
    const rooms: Room[] = await getArticleList(requestParamSample3);
    for (const room of rooms) {
        const articles = await getDetail(room.atclNo);
        await writeDocumentsForRoomDetail(room.atclNo, articles);
    }
}

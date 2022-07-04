import { requestClusterList, requestParamSample3 } from './data/request';
import { openMongo, closeMongo, getNewRooms, getDeletedRooms } from './lib/mongo';
import { sendMessage } from './lib/telegram';
import {
    cleanUpInvalidArticles,
    getTodayNewRooms,
    requestClusters,
    sendDeletedRoomTelegramMessage,
    sendNewRoomTelegramMessage,
} from './routine/article';
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
        await sendMessage('⛹️‍♂️ 지금 매물을 탐색하고 있어요 (12시, 17시쯤)');

        // 1. 유효하지 않은 매물 삭제하기
        await cleanUpInvalidArticles();

        // 2. 매물 목록 파싱하여 등록하기
        await requestClusters(requestClusterList);

        // 3. 오늘 삭제된 매물 가져와서 텔레그램 메시지 보내기
        const deletedRooms = (await getDeletedRooms(startTime)) as Room[];
        await sendDeletedRoomTelegramMessage(deletedRooms);

        // 4. 오늘 올라온 매물 가져와서 텔레그램 메시지 보내기
        const newRooms = await getTodayNewRooms(startTime);
        await sendNewRoomTelegramMessage(newRooms);
    } catch (error) {
        console.error(error);
        console.error('오류가 발생되어 중단되었어요.');
    }
}

async function runOnLocalMachine() {
    // const rooms: Room[] = await getArticleList(requestParamSample3);
    // for (const room of rooms) {
    //     const articles = await getDetail(room.atclNo);
    //     await writeDocumentsForRoomDetail(room.atclNo, articles);
    // }

    // const created: Room[] = (await getNewRooms()) as Room[];
    // console.log(created.length);
    // const deleted: Room[] = (await getDeletedRooms()) as Room[];
    // console.log(deleted.map((room) => room.deletedAt));

    const startTime = new Date();
    const newRooms = await getTodayNewRooms(startTime);

    console.log(newRooms);
    console.log(newRooms.length);
}

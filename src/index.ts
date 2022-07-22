import { COLLECTION_ROOM, COLLECTION_ROOM_DELETED, configs, ICC_CHAT_ID } from './data/config';
import { requestClusterList } from './data/request';
import { diffTimes, sleep } from './lib/common';
import { getKoreaTimezoneString, getUTCDate } from './lib/date';
import { saveFile } from './lib/file';
import { getArticleDetail } from './lib/land';
import {
    openMongo,
    closeMongo,
    getDeletedRooms,
    moveInDocuments,
    getRooms,
    removeDocuments,
    getRoom,
} from './lib/mongo';
import { sendMessage } from './lib/telegram';
import {
    cleanUpInvalidArticles,
    getTodayDeletedRooms,
    getTodayNewRooms,
    requestClusters,
    sendDeletedRoomTelegramMessage,
    sendNewRoomTelegramMessage,
} from './routine/article';
import { Room } from './type/land';
import { deleteLands } from './util/macro';

run();

async function run() {
    try {
        await openMongo();
        await runOnProduction();
        // await runOnLocalMachine();
    } catch (e) {
        console.error('run()', e);
    } finally {
        //////////////////////////////// 프로세스 종료 명시적으로 해야 종료됨.
        console.log('====================== 프로그램 실행 끝');
        await closeMongo();
        process.exit();
    }
}

async function runOnProduction() {
    // 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢 정규 루틴 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢
    const launchedTime = getUTCDate();
    console.time('runOnProduction');
    await sendMessage(ICC_CHAT_ID, `부동산 매물 최신화 작업을 시작합니다.\n${getKoreaTimezoneString(launchedTime)}`);

    // 1. 중개가 종료된 매물 정리하기
    // console.log('중개가 종료된 매물 정리하기');
    // await sendMessage(ICC_CHAT_ID, `✂️ 중개가 종료된 매물부터 정리하겠습니다.`);
    // await cleanUpInvalidArticles();

    // // 2. 매물 목록 파싱하여 등록하기
    const targets = configs.map(({ id }) => id);
    await sendMessage(ICC_CHAT_ID, `⛹️‍♂️ 이제 매물을 최신화하겠습니다. (${targets.join(', ')})`);
    const parsingStartTime = getUTCDate();
    await requestClusters(requestClusterList);
    const parsingDiff = diffTimes(parsingStartTime, getUTCDate());
    await sendMessage(ICC_CHAT_ID, `⏱️ 탐색하는 데 ${parsingDiff}!`);

    for (const { id, filterFunction, chatId } of configs) {
        if (!filterFunction || !chatId) continue;

        try {
            const startTime = getUTCDate();
            await sendMessage(ICC_CHAT_ID, `🔍 ${id} 매물 추출 중...`);
            await sendMessage(chatId, '🔍 매물을 추출하고 있어요.');

            // 오늘 삭제된 매물 가져와서 텔레그램 메시지 보내기
            console.log(`[${id}] 😟 오늘 공고에서 내려간 매물을 찾고 있습니다`);
            const deletedRooms = await getTodayDeletedRooms(startTime, filterFunction, 1);
            await sendDeletedRoomTelegramMessage(deletedRooms, chatId);

            // 오늘 올라온 매물 가져와서 텔레그램 메시지 보내기
            console.log(`[${id}]🚀 오늘 찾은 방을 텔레그램으로 전송하겠습니다`);
            const newRooms = await getTodayNewRooms(startTime, filterFunction, 1);
            await sendNewRoomTelegramMessage(newRooms, chatId);

            sleep(5000); // 텔레그램 메시지 전송 제약으로 인해 쉬어 감.
        } catch (error) {
            console.error('오류가 발생되어 중단되었어요.');
            console.error(error);
            await sendMessage(chatId, '❌ 부동산 탐색 중에 오류가 발생했어요...\n' + (error as Error).toString());
        }
    }
    const launchDiff = diffTimes(launchedTime, getUTCDate());
    const messages = ['매물 수집 완료', getKoreaTimezoneString(), launchDiff];
    await sendMessage(ICC_CHAT_ID, messages.join('\n'));

    console.timeEnd('runOnProduction');
}

async function runOnLocalMachine() {
    try {
        //     await cleanUpInvalidArticles();
        //     // 오늘 삭제된 매물 가져와서 텔레그램 메시지 보내기
        const startTime = getUTCDate();
        //     const deletedRooms = await getTodayDeletedRooms(startTime, configs[0].filterFunction, 1);
        //     await sendDeletedRoomTelegramMessage(deletedRooms, configs[0].chatId || '');

        // 새로운 방
        const newRooms = await getTodayNewRooms(startTime, configs[0].filterFunction, 2);
        await sendNewRoomTelegramMessage(newRooms, configs[0].chatId || '');

        const article = await getArticleDetail(2224902465);
        await saveFile(`article-detail-${Date.now()}.html`, article);

        // 방 검색
        // const rooms = (await getRooms()) as Room[];
        // const a = rooms.filter((room) => room?.address?.startsWith('...')).map((room) => room.atclNo);
        // console.log(a);
        // const drooms = rooms.filter((room) => room?.address?.startsWith('...'));
        // await removeDocuments(COLLECTION_ROOM, drooms);
    } catch (e) {
        console.error('runOnLocalMachine', e);
    }
}

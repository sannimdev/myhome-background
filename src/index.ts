import { configs, ICC_CHAT_ID } from './data/config';
import { requestClusterList } from './data/request';
import { sleep } from './lib/common';
import { getKoreaTimezoneString, getUTCDate } from './lib/date';
import { openMongo, closeMongo } from './lib/mongo';
import { sendMessage } from './lib/telegram';
import {
    cleanUpInvalidArticles,
    getTodayDeletedRooms,
    getTodayNewRooms,
    requestClusters,
    sendDeletedRoomTelegramMessage,
    sendNewRoomTelegramMessage,
} from './routine/article';

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
        await closeMongo();
        process.exit();
    }
}

async function runOnProduction() {
    // 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢 정규 루틴 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢
    const startTime: string = getKoreaTimezoneString();
    console.time('runOnProduction');
    await sendMessage(ICC_CHAT_ID, `부동산 매물 파싱 작업을 시작합니다.\n${startTime}`);

    // 1. 유효하지 않은 매물 삭제하기
    await sendMessage(ICC_CHAT_ID, `❌ 유효하지 않은 매물을 삭제하겠습니다.`);
    await cleanUpInvalidArticles();

    // // 2. 매물 목록 파싱하여 등록하기
    const targets = configs.map(({ id }) => id);
    await sendMessage(ICC_CHAT_ID, `👏 이제 매물을 파싱하겠습니다. (${targets.join(', ')})`);
    await requestClusters(requestClusterList);

    for (const { id, filterFunction, chatId } of configs) {
        if (!filterFunction || !chatId) continue;

        try {
            const startTime = getUTCDate();
            await sendMessage(ICC_CHAT_ID, `🔍 ${id} 매물 탐색 중...`);
            await sendMessage(chatId, '👟 매물을 탐색하고 있어요.');

            // 오늘 삭제된 매물 가져와서 텔레그램 메시지 보내기
            const deletedRooms = await getTodayDeletedRooms(startTime, filterFunction, 1);
            await sendDeletedRoomTelegramMessage(deletedRooms, chatId);

            // 오늘 올라온 매물 가져와서 텔레그램 메시지 보내기
            const newRooms = await getTodayNewRooms(startTime, filterFunction, 1);
            await sendNewRoomTelegramMessage(newRooms, chatId);

            sleep(5000); // 텔레그램 메시지 전송 제약으로 인해 쉬어 감.
        } catch (error) {
            console.error(error);
            console.error('오류가 발생되어 중단되었어요.');
            await sendMessage(chatId, '❌ 부동산 탐색 중에 오류가 발생했어요...');
            await sendMessage(chatId, (error as Error).toString());
        }
    }
    console.timeEnd('runOnProduction');
}

async function runOnLocalMachine() {}

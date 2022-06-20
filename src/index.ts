import {
    getArticleList,
    getDetail,
    getDetailImages,
    writeDocumentsForRoomDetail,
    writeDocumentsForRooms,
} from './article';
import { requestParamSample3 } from './data/request';
import { IS_LOCAL_MACHINE } from './lib/environment';
import { client } from './lib/mongo';
import { Room } from './type/land';

async function run() {
    try {
        if (false && IS_LOCAL_MACHINE) {
            await runOnLocalMachine();
        } else {
            await runOnProduction();
        }
    } catch (e) {
        console.error('run()', e);
    } finally {
        //////////////////////////////// 프로세스 종료 명시적으로 해야 종료됨.
        client.close();
        process.exit();
    }
}

async function runOnLocalMachine() {
    // ✂️ 필요한 부분만 빨리 로컬머신에서 돌릴 때
    const no = 2219494127;
    const response = await getDetail(no);
    const images = await getDetailImages(no);
    console.log('🚚', images);
}

async function runOnProduction() {
    // 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢 정규 루틴 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢
    // 매물 목록 파싱하기
    const rooms: Room[] = await getArticleList(requestParamSample3);
    await writeDocumentsForRooms(rooms);

    // // 매물 상세 파싱하기
    const details = await Promise.allSettled(
        rooms.map(async (room) => {
            const articles = await getDetail(room.atclNo);
            await writeDocumentsForRoomDetail(room.atclNo, articles);
        })
    );
    console.log(details.filter(({ status }) => status === 'fulfilled'));
}

run();

import { requestParamSample3 } from './data/request';
import { IS_LOCAL_MACHINE } from './lib/environment';
import { openMongo, closeMongo, getRooms } from './lib/mongo';
import { cleanUpInvalidArticles, requestArticles } from './routine/article';

run();

async function run() {
    try {
        await openMongo();
        if (false && IS_LOCAL_MACHINE) {
            await runOnLocalMachine();
        } else {
            await runOnProduction();
        }
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
    const params = [requestParamSample3];
    for (const param of params) {
        await requestArticles(param);
    }
}

async function runOnLocalMachine() {
    // ✂️ 필요한 부분만 빨리 로컬머신에서 돌릴 때
    // const no = 2219494127;
    // const response = await getDetail(no);
    // const images = await getDetailImages(no);
    // console.log('🚚', images);
    // const rooms = (await getRooms()) as Room[];
    // console.log(response);
}

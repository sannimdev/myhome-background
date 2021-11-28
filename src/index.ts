import { Room } from './type/land';
import { addDocument } from './lib/mongo';
import { saveFile } from './lib/file';
import { IS_LOCAL_MACHINE } from './lib/environment';
import { getArticle } from './land';
import { requestParamSample } from './data/request';

async function run() {
    try {
        // 현재는 모든 API의 페이징을 고려하지 않고 작성한다. (일단 구현이 시급...)
        const rooms = await (async () => {
            const rooms: Room[] = [];
            let page = 1;
            while (true) {
                const room = await getArticle(requestParamSample, page);
                Object.assign(rooms, [...rooms, ...room]);
                page += 1;
                if (room.length === 20) {
                    console.log(
                        `${page - 1}페이지 수집을 종료하고 다음 ${page}페이지 정보를 수집합니다`
                    );
                } else {
                    console.log('수집을 종료합니다...');
                    break;
                }
            }
            return rooms;
        })();
        IS_LOCAL_MACHINE
            ? await saveFile(`${Date.now()}.json`, JSON.stringify(rooms, null, 4))
            : await addDocument(`room`, rooms);
    } catch (e) {
        console.error('run()', e);
    } finally {
        //////////////////////////////// 프로세스 종료 명시적으로 해야 종료됨.
        process.exit();
    }
}

run();

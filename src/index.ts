import {
    getArticleList,
    getDetail,
    getDetailImages,
    writeDocumentsForRoomDetail,
    writeDocumentsForRooms,
} from './article';
import { requestParamSample3 } from './data/request';
import { Room } from './type/land';

async function run() {
    try {
        /*
        🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢 정규 루틴 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢
        */
        // 매물 목록 파싱하기
        const rooms: Room[] = await getArticleList(requestParamSample3);
        await writeDocumentsForRooms(rooms);

        // // 매물 상세 파싱하기
        const details = await Promise.allSettled(
            rooms.map(async (room) => {
                const articles = await getDetail(room.atclNo);
                await writeDocumentsForRoomDetail(room.atclNo, articles);

                // const images = await getDetailImages(room.atclNo); 매물 이미지 정보 파싱
            })
        );
        console.log(details.filter(({ status }) => status === 'fulfilled'));

        /*🚨 쾌속 테스트 */
        // const no = 2219494127;
        // const response = await getDetail(no);
        // const images = await getDetailImages(no);
        // await writeDocumentsForRoomDetail(no, images);
        // console.log('🚚', images);
    } catch (e) {
        console.error('run()', e);
    } finally {
        //////////////////////////////// 프로세스 종료 명시적으로 해야 종료됨.
        process.exit();
    }
}

run();

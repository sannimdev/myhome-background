import {
    getArticleList,
    getDetail,
    getDetailImages,
    writeDocumentsForRoomDetail,
    writeDocumentsForRooms,
} from './article';
import { requestParamSample2 } from './data/request';
import { Room } from './type/land';

async function run() {
    try {
        /*
        🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢 정규 루틴 🏢🏢🏢🏢🏢🏢🏢🏢🏢🏢
        */
        // 매물 목록 파싱하기
        // const rooms: Room[] = await getArticleList(requestParamSample2);
        // await writeDocumentsForRooms(rooms);

        // // 매물 상세 파싱하기
        // const dummyRooms = [rooms[0], rooms[1]];
        // const details = await Promise.allSettled(
        //     dummyRooms.map(async (room) => {
        //         const response = await getDetail(room.atclNo);
        //         await writeDocumentsForRoomDetail(room.atclNo, response);
        //     })
        // );
        // console.log(details.filter(({ status }) => status === 'fulfilled'));

        /*🚨 쾌속 루틴 */
        const no = 1638277852486;
        // const response = await getDetail(no);
        const images = await getDetailImages(no);
        // await writeDocumentsForRoomDetail(no, images);
        console.log('🚚', images);
    } catch (e) {
        console.error('run()', e);
    } finally {
        //////////////////////////////// 프로세스 종료 명시적으로 해야 종료됨.
        process.exit();
    }
}

run();

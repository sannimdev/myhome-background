import { getNaverLandToken, testComplex, testOneTwoRoom, testVilla } from './land';
import { Room } from './type/land';
// import { saveFile } from './lib/file';
import { addDocument } from './lib/mongo';
import { saveFile } from './lib/file';
import { IS_LOCAL_MACHINE } from './lib/environment';

async function run() {
    try {
        const NAVER_TOKEN = await getNaverLandToken();
        // 현재는 모든 API의 페이징을 고려하지 않고 작성한다. (일단 구현이 시급...)
        // TODO: 아파트 오피스텔, 빌라 주택 파싱하는 모듈을 만들어서 따로 빼기
        const houses = await Promise.allSettled([testComplex(), testVilla()]);
        const fulfilled = houses.filter(
            ({ status }) => status === 'fulfilled'
        ) as PromiseFulfilledResult<Room[]>[];
        const types = ['complex', 'villa', 'onetworoom'];
        const writeDB = await Promise.allSettled(
            fulfilled.map(async ({ value }, idx) =>
                IS_LOCAL_MACHINE
                    ? saveFile(`${Date.now()}-${types[idx]}.json`, JSON.stringify(value, null, 4))
                    : addDocument(types[idx], value)
            )
        );
        console.log('아파트오피스텔, 빌라주택 결과', writeDB);
        // TODO 원룸 투룸을 파싱하는 모듈을 만들어서 따로 빼기
        const articleList = (await testOneTwoRoom(NAVER_TOKEN)) || [];
        if (articleList.length > 0) {
            IS_LOCAL_MACHINE
                ? saveFile(`${Date.now()}-onetworoom.json`, JSON.stringify(articleList, null, 4))
                : addDocument('onetworoom', articleList);
            console.log('원룸 투룸 파싱 후 기록 완료');
        } else {
            console.log('원룸, 투룸 조회 결과가 없습니다.');
        }
    } catch (e) {
        console.error('run()', e);
    } finally {
        //////////////////////////////// 프로세스 종료 명시적으로 해야 종료됨.
        process.exit();
    }
}

run();

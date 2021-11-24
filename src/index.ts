import { testComplex, testVilla } from './land';
import { Room } from './type/land';
// import { saveFile } from './lib/file';
import { addDocument } from './lib/mongo';
import { saveFile } from './lib/file';
import { IS_LOCAL_MACHINE } from './lib/environment';

async function run() {
    // await saveFile(`${Date.now()}-houses.json`, JSON.stringify(houses, null, 4));
    // const result = Array.isArray(houses) && (await addDocument('villa', houses));
    // console.log(result);
    ///////////////////////////////////////////////////////////////////////////////////
    const houses = await Promise.allSettled([testComplex(), testVilla()]);
    const fulfilled = houses.filter(
        ({ status }) => status === 'fulfilled'
    ) as PromiseFulfilledResult<Room[]>[];
    const types = ['complex', 'villa'];
    const writeDB = await Promise.allSettled(
        fulfilled.map(async ({ value }, idx) =>
            IS_LOCAL_MACHINE
                ? saveFile(`${Date.now()}-${types[idx]}.json`, JSON.stringify(value, null, 4))
                : addDocument(types[idx], value)
        )
    );
    console.log(writeDB);
    ////////////////////////////////// 프로세스 종료 명시적으로 해야 종료됨.
    process.exit();
}

run();

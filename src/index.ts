import { testLand } from './land';
import { saveFile } from './lib/file';
import { addDocument } from './lib/mongo';

async function run() {
    const houses = await testLand();
    await saveFile(`${Date.now()}-houses.json`, JSON.stringify(houses, null, 4));
    const result = Array.isArray(houses) && (await addDocument('house', houses));
    console.log(result);
    process.exit();
}

run();

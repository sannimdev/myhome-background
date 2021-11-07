import { testLand } from './land';
import { saveFile } from './lib/file';

async function run() {
    const houses = await testLand();
    await saveFile(`${Date.now()}-houses.json`, JSON.stringify(houses, null, 4));
}

run();

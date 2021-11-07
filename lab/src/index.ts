import { testLand } from './util/land';

async function run() {
    const data = await testLand();
    console.log(data);
}

run();

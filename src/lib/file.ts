import { parse } from 'path';
import * as fs from 'fs';

export async function saveFile(filename: string, data: string) {
    try {
        const route = parse(__dirname);
        const directory = `${route.dir}/../output`;
        if (!fs.existsSync(directory)) fs.mkdirSync(directory);
        fs.writeFileSync(`${directory}/${filename}`, data);
    } catch (e) {
        console.error(e);
    }
}

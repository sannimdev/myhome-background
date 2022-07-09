import dotenv from 'dotenv';
import { parse } from 'path';
import { getBinRoomFilterFunction, getMyRoomFilterFunction, getYRoomFilterFunction } from './roomFilters';

const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
const getProcessEnv = (key: string) => (env ? env[key] : process.env[key]);
export const ICC_CHAT_ID: string = getProcessEnv('TELEGRAM_CHAT_ID') || '';
export const COLLECTION_ROOM = 'room';
export const COLLECTION_ROOM_DELETED = 'room_deleted';

type Config = {
    id: string;
    filterFunction: Function;
    chatId?: string;
};
export const configs: Config[] = [
    {
        id: 'MY',
        filterFunction: getMyRoomFilterFunction,
        chatId: getProcessEnv('TELEGRAM_MY_CHAT_ID'),
    },
    {
        id: 'Y',
        filterFunction: getYRoomFilterFunction,
        chatId: getProcessEnv('TELEGRAM_Y_CHAT_ID'),
    },
    {
        id: 'BIN',
        filterFunction: getBinRoomFilterFunction,
        chatId: getProcessEnv('TELEGRAM_BIN_CHAT_ID'),
    },
];

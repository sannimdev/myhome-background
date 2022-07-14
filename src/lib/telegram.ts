import dotenv from 'dotenv';
import { parse } from 'path';
import axios from 'axios';
import { sleep } from './common';
import { IS_LOCAL_MACHINE } from '../data/environment';
import { DEV_CHAT_ID } from '../data/config';

const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
const TOKEN = env ? env.TELEGRAM_TOKEN : process.env.TELEGRAM_TOKEN;

console.log(`loading telegram... TOKEN=${!!TOKEN}`);

const getMessageApiUrl = ({ token, chatId, message }: { token?: string; chatId?: string; message: string }) =>
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;

export const sendMessage = async (chatId: string | number, message: string | number) => {
    try {
        if (!TOKEN || !chatId) {
            throw new Error(`Sending telegram message has been failed. (TOKEN=${TOKEN}, chatId=${chatId})`);
        }

        const url = getMessageApiUrl({
            token: TOKEN,
            chatId: String(IS_LOCAL_MACHINE ? DEV_CHAT_ID : chatId),
            message: encodeURI(String(message)),
        });
        const { data } = await axios.get(url);
        sleep(1000);
        return data;
    } catch (error) {
        console.error(error);
        sleep(10000);
    }
};

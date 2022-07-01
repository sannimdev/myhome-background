import dotenv, { parse } from 'dotenv';
import axios from 'axios';

const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
const TOKEN = env ? env.TELEGRAM_TOKEN : process.env.TELEGRAM_TOKEN;
const CHAT_ID = env ? env.TELEGRAM_CHAT_ID : process.env.TELEGRAM_CHAT_ID;

const getMessageApiUrl = ({ token, chatId, message }: { token?: string; chatId?: string; message: string }) =>
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;

export const sendMessage = async (message: string | number) => {
    try {
        const url = getMessageApiUrl({
            token: TOKEN,
            chatId: CHAT_ID,
            message: encodeURI(String(message)),
        });
        const { data } = await axios.get(url);
        return data;
    } catch (error) {
        console.error(error);
    }
};

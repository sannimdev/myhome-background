import dotenv from 'dotenv';
import { parse } from 'path';

export const IS_LOCAL_MACHINE = ((forceValue) => {
    if (forceValue !== undefined) {
        return forceValue;
    }
    const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
    return !!env;
})(/* forceValue */ false);

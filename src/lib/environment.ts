import dotenv from 'dotenv';
import { parse } from 'path';

// export const IS_LOCAL_MACHINE = (() => {
//     // Connection URL
//     const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
//     return !!env;
// })();

export const IS_LOCAL_MACHINE = false;

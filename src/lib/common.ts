export async function sleep(ms: number = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function diffTimes(_s: Date, _e: Date) {
    const [s, e] = [_s.getTime(), _e.getTime()];
    const diff = (e - s) / 1000;
    const result = diff >= 60 ? `${Math.floor(diff / 60)}분 ${Math.floor(diff % 60)}초` : `${diff}초`;
    return result + ' 소요';
}

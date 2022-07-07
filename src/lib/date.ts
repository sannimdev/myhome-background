export function getUTCDate(date: Date = new Date()): Date {
    return new Date(date.getTime() + date.getTimezoneOffset());
}

export function getKoreaTimezoneString(date: Date | undefined) {
    if (!date) return '';
    return new Date(date.toUTCString()).toLocaleString('ko-KR');
}

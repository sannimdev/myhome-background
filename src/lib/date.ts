export function getUTCDate(date: Date = new Date()): Date {
    return new Date(date.getTime() + date.getTimezoneOffset());
}

export function getKoreaTimezoneString(date: Date | undefined) {
    if (!date) return '';
    return date.toLocaleString('ko-KR');
}

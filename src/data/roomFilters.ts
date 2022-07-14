import { Room } from '../type/land';

export function getMyRoomFilterFunction(room: Room): boolean {
    return (
        (room.prc <= 24000 &&
            room.myhomeRoomDetail?.address?.startsWith('경기도 성남시') &&
            room.tagList.includes('융자금없는') &&
            !room.flrInfo.startsWith('B1/') &&
            room.tradTpCd === 'B1') ||
        false
    );
}

export function getYRoomFilterFunction(room: Room): boolean {
    return (
        (room.prc <= 15000 &&
            room.myhomeRoomDetail?.address?.startsWith('경기도 용인시') &&
            room.tagList.includes('융자금없는') &&
            !room.flrInfo.startsWith('B1/') &&
            room.tradTpCd === 'B1') ||
        false
    );
}

export function getBinRoomFilterFunction(room: Room): boolean {
    return (
        (room.prc >= 10000 &&
            room.myhomeRoomDetail?.address?.startsWith('인천시 부평구') &&
            room.tagList.includes('융자금없는') &&
            !room.flrInfo.startsWith('B1/') &&
            room.tradTpCd === 'B1') ||
        false
    );
}

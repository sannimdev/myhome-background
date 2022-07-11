import { removeDocuments } from '../lib/mongo';
import { getUTCDate } from '../lib/date';
import { getTodayNewRooms } from '../routine/article';
import { Room } from '../type/land';

export async function deleteLands(startsAddressWith: string) {
    const startTime = getUTCDate();

    const newRooms: Room[] = await getTodayNewRooms(startTime, (room: Room) =>
        room.myhomeRoomDetail?.address?.startsWith(startsAddressWith)
    );
    const elements = newRooms.map(({ atclNo }) => ({ atclNo }));
    console.log(elements);
    await removeDocuments('room', elements);
}

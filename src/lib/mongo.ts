import { parse } from 'path';
import { Collection, Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Room, RoomDetail } from '../type/land';
import { getUTCDate } from './date';
import { COLLECTION_ROOM, COLLECTION_ROOM_DELETED } from '../data/config';

// Connection URL
const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
console.log('loading mongo...');
const id = env ? env.MONGODB_ID : process.env.MONGODB_ID;
const pw = env ? env.MONGODB_PW : process.env.MONGODB_PW;
const dbName = env ? env.MONGODB_NAME : process.env.MONGODB_NAME || '';
console.log(`id ${!!id}, pw ${!!pw}, dbName ${!!dbName}`);

const url = `mongodb+srv://${id}:${pw}@cluster0.scwj7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url);
export const openMongo = async () => client.connect();
export const closeMongo = async () => client.close();

export function accessMongo(collectionName: string, callback: (collection: Collection, db: Db) => {}): any {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return callback(collection, db);
}

export async function addDocuments(collectionName: string, elements: any[]) {
    try {
        return accessMongo(collectionName, async (collection) => collection.insertMany(elements));
    } catch (e) {
        console.error('add Document', e);
        throw e;
    }
}

export async function removeDocuments(collectionName: string, elements: any[]) {
    try {
        return accessMongo(collectionName, async (collection) => {
            const deletedResult = [];
            for (const element of elements) {
                const result = await collection.deleteOne(element);
                deletedResult.push(result);
            }
            console.log(deletedResult);
            return true;
        });
    } catch (e) {
        console.error('delete Document', e);
        throw e;
    }
}

export async function moveInDocuments(fromCollectionName: string, toCollectionName: string, elements: any[]) {
    try {
        await addDocuments(toCollectionName, elements);
        await removeDocuments(fromCollectionName, elements);
    } catch (e) {
        console.error('moveInDocuments', e);
        throw e;
    }
}

export async function getNewRooms(currentDate: Date = getUTCDate(), hoursAgo: number = 1): Promise<Room[] | Error> {
    try {
        return accessMongo(COLLECTION_ROOM, (collection) => {
            currentDate.setHours(currentDate.getHours() - hoursAgo, 0, 0, 0);
            return collection
                .find({
                    createdAt: { $gte: new Date(currentDate.toISOString()) },
                    deletedAt: { $exists: false },
                })
                .sort({ prc: 1, updatedAt: -1, createdAt: -1 })
                .toArray() as Promise<Room[]>;
        });
    } catch (e) {
        console.error('getNewRooms', e);
        throw e;
    }
}

export async function getDeletedRooms(currentDate: Date = getUTCDate(), hoursAgo: number = 1): Promise<Room[] | Error> {
    try {
        return accessMongo(COLLECTION_ROOM_DELETED, (collection) => {
            currentDate.setHours(currentDate.getHours() - hoursAgo, 0, 0, 0);
            return collection
                .find({
                    deletedAt: { $gte: new Date(currentDate.toISOString()) },
                })
                .sort({ deletedAt: -1 })
                .toArray() as Promise<Room[]>;
        });
    } catch (e) {
        console.error('getDeletedRooms', e);
        throw e;
    }
}

export async function getRooms(): Promise<Room[] | Error> {
    try {
        return accessMongo(COLLECTION_ROOM, (collection) => collection.find().toArray() as Promise<Room[]>);
    } catch (e) {
        console.error('getRooms', e);
        throw e;
    }
}

export async function getRoom(articleNo: number | string) {
    try {
        return accessMongo(COLLECTION_ROOM, (collection) => collection.find({ atclNo: articleNo }).toArray());
    } catch (e) {
        console.error('getRoom', e);
        throw e;
    }
}

// 매물 목록 파싱 시 최신데이터로 덮어쓰기
export async function overwriteRooms(rooms: Room[]) {
    try {
        return accessMongo(COLLECTION_ROOM, async (collection) => {
            for (const room of rooms) {
                const mongoRoom = await collection.findOne({ atclNo: room.atclNo + '' });
                if (!!mongoRoom)
                    await collection.updateOne(
                        { atclNo: room.atclNo + '' },
                        {
                            $set: {
                                ...room,
                                _id: mongoRoom._id,
                                updatedAt: getUTCDate(),
                                createdAt: mongoRoom.createdAt,
                            },
                        }
                    );
                else await collection.insertOne(room);
            }
        });
    } catch (e) {
        console.error('overwriteRoom', e);
        throw e;
    }
}

// 매물 상세 정보 파싱 시 최신데이터 결합하여 덮어쓰기
export async function updateMyHomeRoomDetail(articleNo: number | string, myhomeRoomDetail: RoomDetail) {
    try {
        return accessMongo(COLLECTION_ROOM, async (collection) => {
            const room = await collection.findOne({ atclNo: articleNo });
            if (room) {
                return collection.updateOne(
                    { atclNo: articleNo + '' },
                    {
                        $set: {
                            ...room,
                            myhomeRoomDetail,
                            _id: room._id,
                            updatedAt: getUTCDate(),
                            createdAt: room.createdAt,
                        },
                    }
                );
            }
            return null;
        });
    } catch (e) {
        console.error('overwriteRoom', e);
        throw e;
    }
}

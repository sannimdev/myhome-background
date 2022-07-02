import { parse } from 'path';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Room, RoomDetail } from '../type/land';

// Connection URL
const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
console.log('loading mongo...');
const id = env ? env.MONGODB_ID : process.env.MONGODB_ID;
const pw = env ? env.MONGODB_PW : process.env.MONGODB_PW;
const dbName = env ? env.MONGODB_NAME : process.env.MONGODB_NAME;
console.log(`id ${!!id}, pw ${!!pw}, dbName ${!!dbName}`);

const url = `mongodb+srv://${id}:${pw}@cluster0.scwj7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url);
export const openMongo = async () => client.connect();
export const closeMongo = async () => client.close();

export async function addDocument(collectionName: string, elements: any[]) {
    try {
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        // the following code examples can be pasted here...
        const insertResult = await collection.insertMany(elements);
        return insertResult;
    } catch (e) {
        console.error('add Document', e);
        throw e;
    }
}

export async function getNewRooms(currentStart: Date = new Date()): Promise<Room[] | Error> {
    try {
        const db = client.db(dbName);
        const collection = db.collection('room');
        currentStart.setHours(currentStart.getUTCHours(), 0, 0, 0);
        console.log(currentStart);
        return collection
            .find({
                createdAt: { $gte: currentStart },
                deletedAt: { $exists: false },
            })
            .sort({ prc: 1, updatedAt: -1, createdAt: -1 })
            .toArray() as Promise<Room[]>;
    } catch (e) {
        console.error('getNewRooms', e);
        throw e;
    }
}

export async function getRooms(): Promise<Room[] | Error> {
    try {
        const db = client.db(dbName);
        const collection = db.collection('room');
        return collection.find().toArray() as Promise<Room[]>;
    } catch (e) {
        console.error('getRooms', e);
        throw e;
    }
}

export async function getRoom(articleNo: number | string) {
    try {
        const db = client.db(dbName);
        const collection = db.collection('room');
        const result = await collection.find({ atclNo: articleNo }).toArray();
        return result;
    } catch (e) {
        console.error('getRoom', e);
        throw e;
    }
}

// 매물 목록 파싱 시 최신데이터로 덮어쓰기
export async function overwriteRooms(rooms: Room[]) {
    try {
        const db = client.db(dbName);
        const collection = db.collection('room');
        for (const room of rooms) {
            const mongoRoom = await collection.findOne({ atclNo: room.atclNo + '' });
            if (!!mongoRoom)
                await collection.updateOne(
                    { atclNo: room.atclNo + '' },
                    { $set: { ...room, _id: mongoRoom._id, updatedAt: new Date() } }
                );
            else await collection.insertOne(room);
        }
    } catch (e) {
        console.error('overwriteRoom', e);
        throw e;
    }
}

// 매물 상세 정보 파싱 시 최신데이터 결합하여 덮어쓰기
export async function overwriteRoom(articleNo: number | string, myhomeRoomDetail: RoomDetail) {
    try {
        const db = client.db(dbName);
        const collection = db.collection('room');
        const room = await collection.findOne({ atclNo: articleNo });
        if (room) {
            await collection.updateOne(
                { atclNo: articleNo + '' },
                {
                    $set: { ...room, myhomeRoomDetail, _id: room._id, updatedAt: new Date() },
                }
            );
        }
    } catch (e) {
        console.error('overwriteRoom', e);
        throw e;
    }
}

import { parse } from 'path';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Room, RoomDetail } from '../type/land';

// Connection URL
const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
console.log('계정 =======================');
const id = env ? env.MONGODB_ID : process.env.MONGODB_ID;
const pw = env ? env.MONGODB_PW : process.env.MONGODB_PW;
const dbName = env ? env.MONGODB_NAME : process.env.MONGODB_NAME;
console.log(`id ${!!id}, pw ${!!pw}, dbName ${!!dbName}`);

const url = `mongodb+srv://${id}:${pw}@cluster0.scwj7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url);

export async function addDocument(collectionName: string, elements: any[]) {
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        // the following code examples can be pasted here...
        const insertResult = await collection.insertMany(elements);
        return insertResult;
    } catch (e) {
        console.error('add Document', e);
    }
}

export async function getRoom(articleNo: number | string) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('room');
        const result = await collection.find({ id: articleNo }).toArray();
        return result;
    } catch (e) {
        console.error('getRoom', e);
        return e;
    } finally {
        client.close();
    }
}

// 매물 목록 파싱 시 최신데이터로 덮어쓰기
export async function overwriteRooms(rooms: Room[]) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('room');
        for (const room of rooms) {
            await collection.findOneAndReplace({ id: room.atclNo }, room);
        }
    } catch (e) {
        console.error('overwriteRoom', e);
        return e;
    } finally {
        client.close();
    }
}

// 매물 상세 정보 파싱 시 최신데이터 결합하여 덮어쓰기
export async function overwriteRoom(articleNo: number | string, myhomeRoomDetail: RoomDetail) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('room');
        const room = await collection.findOne({ id: articleNo });
        if (room) {
            await collection.findOneAndReplace({ id: articleNo }, { ...room, myhomeRoomDetail } as Room);
        }
    } catch (e) {
        console.error('overwriteRoom', e);
        return e;
    } finally {
        client.close();
    }
}

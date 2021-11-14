import { parse } from 'path';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Connection URL
const { parsed: env } = dotenv.config({ path: `${parse(__dirname).dir}/../.env` });
const id = env ? env.MONGODB_ID : '';
const pw = env ? env.MONGODB_PASSWORD : '';
const dbName = env ? env.MONGODB_NAME : '';
const url = `mongodb+srv://${id}:${pw}@cluster0.r7tht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
        console.error(e);
    }
}

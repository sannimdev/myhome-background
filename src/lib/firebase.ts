import {
    getFirestore,
    collection,
    addDoc,
    CollectionReference,
    DocumentData,
    getDocs,
    setLogLevel,
} from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { Room } from '../type/land';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function addRoom(room?: Room) {
    try {
        console.log('Adding rooms to google firebase');
        await addDocument(await collection(db, 'room'), { createdAt: Date.now() });
        // Get a list of cities from your database
        const citiesCol = collection(db, 'cities');
        const citySnapshot = await getDocs(citiesCol);
        const cityList = citySnapshot.docs.map((doc) => doc.data());
        return cityList;
    } catch (e) {
        console.error('addRoom', e);
        throw e;
    }
}

export async function overwriteRoom(/*articleNo: number | string, myhomeRoomDetail: RoomDetail*/) {
    try {
    } catch (e) {
        console.error('overwriteRoom', e);
        throw e;
    }
}

async function addDocument(collection: CollectionReference<DocumentData>, element: any) {
    return addDoc(collection, element);
}

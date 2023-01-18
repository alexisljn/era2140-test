import {initializeApp} from "firebase/app";
import {BigNumber} from "ethers";
import {getAuth, signInAnonymously} from "firebase/auth";
import {getDownloadURL, getStorage, ref, uploadString} from "firebase/storage";

async function initializeFirebase() {
    const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
    }

    initializeApp(config);

    await signInFirebase();
}

async function postMetadata(metadata: string, tokenId: BigNumber) {
    const storage = getStorage();

    const bucket = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

    const metadataRef = ref(storage, `${bucket}/${tokenId.toString()}.json`);

    await uploadString(metadataRef, metadata);
}

async function generateMetadata(score: number, time: number): Promise<string> {
    const storage = getStorage();

    const badgeRef = ref(storage,`img/badge-${score}.png`);

    const badgeUrl = await getDownloadURL(badgeRef);

    return JSON.stringify({
        description: 'Certification from QuizResult smart contract',
        external_url: String(process.env.FRONTEND_URL),
        image: badgeUrl,
        background_color: '#000',
        score,
        time
    });
}

async function signInFirebase() {
    const auth = getAuth();

    await signInAnonymously(auth);
}

export {initializeFirebase, generateMetadata, postMetadata}
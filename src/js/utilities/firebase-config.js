import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';

const config = {
	// apiKey: "AIzaSyAVlOVAZ-C31JtPyMofPhfDJq5IQNoH7IE",
  // authDomain: "face-rec-v1.firebaseapp.com",
  // databaseURL: "https://face-rec-v1.firebaseio.com",
  // projectId: "face-rec-v1",
  // storageBucket: "face-rec-v1.appspot.com",
  // messagingSenderId: "877535852875",
  // appId: "1:877535852875:web:a6021e2ec0aa9b3b7610ce"

  apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseConfig = firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();


export default firebaseConfig;
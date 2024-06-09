import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: "AIzaSyBsHT1i1llIGEb7fqAxbT1TxfOBiqGljZc",
  authDomain: "trailas-texallc.firebaseapp.com",
  projectId: "trailas-texallc",
  storageBucket: "trailas-texallc.appspot.com",
  messagingSenderId: "937236578005",
  appId: "1:937236578005:web:8e9902d55140ab234fec5c",
  measurementId: "G-60E9WBBYL0"
});

const auth = getAuth(app);
const storage = getStorage(app);

export {
  auth,
  storage
};

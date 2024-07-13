import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const fsdb = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({ prompt: "select_account" });

export const googleHandler = async () => {
  provider.setCustomParameters({ prompt: "select_account" });
  signInWithPopup(auth, provider)
    .then((result) => {})
    .catch((error) => {
      console.log(error);
    });
};

export const handleSignOut = async () => {
  signOut(auth)
    .then(() => {
      console.log("logged out");
      window.location.reload();
      return true;
    })
    .catch((error) => {
      console.log(error);
      window.location.reload();
      return false;
    });
};

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSP6zQCiWC5Tjp8-oq_MtA9DjbZOglarQ",
  authDomain: "bahujan-x.firebaseapp.com",
  projectId: "bahujan-x",
  storageBucket: "bahujan-x.firebasestorage.app",
  messagingSenderId: "569280231692",
  appId: "1:569280231692:web:fea721d121e48c480e7129"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

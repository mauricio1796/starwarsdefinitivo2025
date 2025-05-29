import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmxw5CSTJMn0JZE-dtU2uF6ok4Rt-fwiQ",
  authDomain: "starwarsapi1.firebaseapp.com",
  projectId: "starwarsapi1",
  storageBucket: "starwarsapi1.firebasestorage.app",
  messagingSenderId: "124140579449",
  appId: "1:124140579449:web:40d6598680727ec5ab02a8"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ ¡Esto es necesario!

export { auth, db };

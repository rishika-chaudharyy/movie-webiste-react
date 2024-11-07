
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSKEnVvOX5QUZbtf7SU3zp5az0LrkTGU8",
  authDomain: "movie-8dec6.firebaseapp.com",
  projectId: "movie-8dec6",
  storageBucket: "movie-8dec6.firebasestorage.app",
  messagingSenderId: "215167207398",
  appId: "1:215167207398:web:c829513e6f10c79a003827"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const movieRef = collection(db, "movies");
export const ReviewsRef = collection(db, "reviews");
export default app;
export const usersRef = collection(db, "users");
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
} from "firebase/auth";
import { getStorage} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCK4tKHZdzwwX9lAGpuvAcLc2-ztPEc_Pg",
  authDomain: "gestion-stock-association.firebaseapp.com",
  projectId: "gestion-stock-association",
  storageBucket: "gestion-stock-association.appspot.com",
  messagingSenderId: "927087402110",
  appId: "1:927087402110:web:00485443028970cb518c2f",
  measurementId: "G-094W32Q2V2",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export {
    app,
    db,
    auth,
    storage,
    analytics
}
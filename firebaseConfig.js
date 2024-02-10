// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAckZHRyg3pSAkYsnjnjTBBkg3g1MPw8y0",
  authDomain: "strategic-reef-146715.firebaseapp.com",
  databaseURL: "https://strategic-reef-146715-default-rtdb.firebaseio.com/",
  projectId: "strategic-reef-146715",
  storageBucket: "strategic-reef-146715.appspot.com",
  messagingSenderId: "269607392037",
  appId: "1:269607392037:web:0bc0fab46ec3f154b340cc",
  measurementId: "G-LGLEC55M5J"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
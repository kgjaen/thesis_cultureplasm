import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyBwnSM7DBGNubIGbKUPyCvefCMvMEFFLbg",
  authDomain: "cultureplasm.firebaseapp.com",
  databaseURL: "https://cultureplasm.firebaseio.com",
  projectId: "cultureplasm",
  storageBucket: "cultureplasm.appspot.com",
  messagingSenderId: "458801756282",
  appId: "1:458801756282:web:33e4dac81e8864d425e3c3",
  measurementId: "G-L8D2RF2Z9M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };

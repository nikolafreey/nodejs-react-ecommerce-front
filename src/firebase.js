import firebase from "firebase/";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGFMSX10lH5G-EFgCJ6x-nka43mAP_7XU",
  authDomain: "ecommercereactnodejs.firebaseapp.com",
  projectId: "ecommercereactnodejs",
  storageBucket: "ecommercereactnodejs.appspot.com",
  messagingSenderId: "839418114327",
  appId: "1:839418114327:web:376c1bed1222b10e13c752",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

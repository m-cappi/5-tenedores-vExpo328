import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCaH29WG-WIEiToQLXSCKSv7plntf08QgA",
    authDomain: "tenedores-d5e95.firebaseapp.com",
    projectId: "tenedores-d5e95",
    storageBucket: "tenedores-d5e95.appspot.com",
    messagingSenderId: "56249804343",
    appId: "1:56249804343:web:9eda058f7ce1c1045281b2",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

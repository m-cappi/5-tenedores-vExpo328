import React from "react";
import Navigation from "./app/navigations/Navigation";
import { firebaseApp } from "./app/utils/firebase";
// import firebase from "firebase";


export default function App() {
    // useEffect(() => {
    //     //console.log(firebase)
    //     firebase.auth().onAuthStateChanged((user) => console.log(user));
    // }, []);
    return <Navigation />;
}

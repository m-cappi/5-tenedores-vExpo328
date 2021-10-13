import React from "react";
import { LogBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";
// import firebase from "firebase";

LogBox.ignoreLogs(["Setting a timer", "It appears that"]);

export default function App() {
    // useEffect(() => {
    //     //console.log(firebase)
    //     firebase.auth().onAuthStateChanged((user) => console.log(user));
    // }, []);
    return <Navigation />;
}

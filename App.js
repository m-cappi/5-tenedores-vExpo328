import React from "react";
import { LogBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";
// import firebase from "firebase";

LogBox.ignoreLogs([
    "Setting a timer",
    "It appears that",
    "Animated: `useNativeDriver`",
    "expo-permissions is now deprecated",
    " Cannot update a component",
]);

// import {decode, encode} from "base-64"
//if(!global.btoa) global.btoa = encode;
//if(!global.atob) global.atob = decode;

export default function App() {
    // useEffect(() => {
    //     //console.log(firebase)
    //     firebase.auth().onAuthStateChanged((user) => console.log(user));
    // }, []);
    return <Navigation />;
}

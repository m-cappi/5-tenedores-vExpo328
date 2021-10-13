import React, { useEffect, useState } from "react";
//import { View, Text } from "react-native";
// import * as firebase from "firebase";
import firebase from "firebase";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import Loading from "../../components/Loading";

const Account = () => {
    const [login, setLogin] = useState(null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            user ? setLogin(true) : setLogin(false);
        });
    }, []);

    if (login === null)
        return <Loading isVisible={true} text="Cargando..." />;
    return login ? <UserLogged /> : <UserGuest />;
};

export default Account;

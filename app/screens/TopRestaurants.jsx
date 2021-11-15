import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";

const db = firebase.firestore(firebaseApp);

const TopRestaurants = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const toastRef = useRef();

    useEffect(() => {
        db.collection("restaurants")
            .orderBy("rating", "desc")
            .limit(5)
            .get()
            .then((res) => {
                const restaurantsArr = [];
                res.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    restaurantsArr.push(data);
                });
                setRestaurants(restaurantsArr);
            });
    }, []);

    return (
        <View>
            <ListTopRestaurants
                restaurants={restaurants}
                navigation={navigation}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
};

export default TopRestaurants;

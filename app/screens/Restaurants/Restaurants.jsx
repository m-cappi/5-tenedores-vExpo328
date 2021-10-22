import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";

const db = firebase.firestore(firebaseApp);

const Restaurants = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurants, setStartRestaurants] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const limitRestaurants = 9;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
                .get()
                .then((snap) => {
                    setTotalRestaurants(snap.size);
                });

            const resRestaurants = [];

            db.collection("restaurants")
                .orderBy("createdAt", "asc")
                .limit(limitRestaurants)
                .get()
                .then((res) => {
                    setStartRestaurants(
                        res.docs[res.docs.length - 1].data().createdAt
                    );

                    res.forEach((doc) => {
                        const tempRestaurant = doc.data();
                        tempRestaurant.id = doc.id;

                        resRestaurants.push(tempRestaurant);
                    });
                    setRestaurants(resRestaurants);
                });
        }, [])
    );

    const handleLoadMore = () => {
        if (restaurants.length < totalRestaurants) setIsLoading(true);

        const resRestaurants = [];

        db.collection("restaurants")
            .orderBy("createdAt", "asc")
            .startAfter(startRestaurants)
            .limit(limitRestaurants)
            .get()
            .then((res) => {
                if (res.docs.length > 0) {
                    setStartRestaurants(
                        res.docs[res.docs.length - 1].data().createdAt
                    );
                } else {
                    setIsLoading(false);
                }

                res.forEach((doc) => {
                    const tempRestaurant = doc.data();
                    tempRestaurant.id = doc.id;
                    resRestaurants.push(tempRestaurant);
                });

                setRestaurants([...restaurants, ...resRestaurants]);
                // setRestaurants((currentRestaurants) => [
                //     ...currentRestaurants,
                //     ...resRestaurants,
                // ]); //es mas prolijo pero le hace falta un debounce xq sino duplica
            });
    };

    return (
        <View style={styles.viewBody}>
            <ListRestaurants
                restaurants={restaurants}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />
            {user && (
                <Icon
                    type="material-community"
                    name="plus"
                    reverse
                    color="#00a680"
                    containerStyle={styles.btnContainer}
                    raised={true}
                    onPress={() => navigation.navigate("addRestaurant")}
                />
            )}
        </View>
    );
};

export default Restaurants;

const styles = StyleSheet.create({
    viewBody: { flex: 1, backgroundColor: "#fff" },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "#212121",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
    },
});

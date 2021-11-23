import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import { map } from "lodash";

import firebase from "firebase/app";
import { firebaseApp } from "../../utils/firebase";
import "firebase/firestore";
import Review from "./Review";

const db = firebase.firestore(firebaseApp);

const ListReviews = ({ navigation, idRestaurant }) => {
    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        //verify if the user is logged
        firebase.auth().onAuthStateChanged((user) => {
            user ? setUserLogged(true) : setUserLogged(false);
        });

        //load reviews
        db.collection("reviews")
            .where("idRestaurant", "==", idRestaurant)
            .get()
            .then((res) => {
                const resReviews = [];
                res.forEach((doc) => {
                    const dataTemp = doc.data();
                    dataTemp.id = doc.id;
                    resReviews.push(dataTemp);
                });
                setReviews(resReviews);
            });
    }, []);

    return (
        <View>
            {userLogged ? (
                <Button
                    title="Comparte tu opinion"
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnAddReviewTitle}
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#00a680",
                    }}
                    onPress={() =>
                        navigation.navigate("addRestaurantReview", {
                            idRestaurant: idRestaurant,
                        })
                    }
                />
            ) : (
                <Text
                    style={{
                        textAlign: "center",
                        color: "#00a680",
                        padding: 20,
                    }}
                    onPress={() => navigation.navigate("login")}
                >
                    Necesitas ingresar como usuario para dejar tu comentario.{" "}
                    <Text style={{ fontWeight: "bold" }}>
                        Pulsa AQUI para iniciar sesion.
                    </Text>
                </Text>
            )}
            {map(reviews, (review, index) => (
                <Review key={index} review={review} />
            ))}
        </View>
    );
};

export default ListReviews;

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent",
    },
    btnAddReviewTitle: {
        color: "#00a680",
    },
});

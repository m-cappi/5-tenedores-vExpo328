import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import firebase from "firebase/app";
import { firebaseApp } from "../../utils/firebase";
import { NavigationContainer } from "@react-navigation/native";

const db = firebase.firestore(firebaseApp);

const ListReviews = ({ navigation, idRestaurant, setRating }) => {
    const [userLogged, setUserLogged] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            user ? setUserLogged(true) : setUserLogged(false);
        });
    }, []);

    return (
        <View>
            <Text>ListReviews...</Text>
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

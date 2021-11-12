import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, ScrollView, Dimensions, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import Toast from "react-native-easy-toast";

import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";

import Loading from "../../components/Loading";
import CarouselImg from "../../components/CarouselImg";
import RestaurantBanner from "../../components/Restaurants/RestaurantBanner";
import RestaurantInfo from "../../components/Restaurants/RestaurantInfo";
import ListReviews from "../../components/Restaurants/ListReviews";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

const Restaurant = ({ navigation, route }) => {
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isUserLogged, setIsUserLogged] = useState(false);
    const toastRef = useRef();

    navigation.setOptions({ title: name });

    firebase.auth().onAuthStateChanged((user) => {
        user ? setIsUserLogged(true) : setIsUserLogged(false);
    });

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
                .doc(id)
                .get()
                .then((res) => {
                    const data = res.data();
                    data.id = res.id;
                    setRestaurant(data);
                    setRating(data.rating);
                });
        }, [])
    );

    useEffect(() => {
        if (isUserLogged && restaurant) {
            db.collection("favorites")
                .where("idRestaurant", "==", restaurant.id)
                .where("idUser", "==", firebase.auth().currentUser.uid)
                .get()
                .then((res) => {
                    if (res.docs.length === 1) {
                        setIsFavorite(true);
                    }
                })
                .catch();
        }
    }, [isUserLogged, restaurant]);

    const handleFavorite = () => {
        if (!isUserLogged) {
            //User is not logged -> no access to favorites menu
            toastRef.current.show(
                "Para usar el sistema de favoritos, tienes que estar logeado!",
                4000
            );
        } else {
            if (isFavorite) {
                //Restaurant IS a favorite and it has to be REMOVED

                db.collection("favorites")
                    .where("idRestaurant", "==", restaurant.id)
                    .where("idUser", "==", firebase.auth().currentUser.uid)
                    .get()
                    .then((res) => {
                        res.forEach((doc) => {
                            const idFavorite = doc.id;
                            db.collection("favorites")
                                .doc(idFavorite)
                                .delete()
                                .then((res) => {
                                    setIsFavorite(false);
                                    toastRef.current.show(
                                        "Restaurante elminado de favoritos"
                                    );
                                })
                                .catch(() => {
                                    toastRef.current.show(
                                        "Error al eliminar el restaurante de favoritos"
                                    );
                                });
                        });
                    })
                    .catch((err) => {
                        toastRef.current.show("Error?");
                        console.log(err);
                    });
            } else {
                //Restaurant is NOT a favorite and it has to be ADDED
                const payload = {
                    idUser: firebase.auth().currentUser.uid,
                    idRestaurant: restaurant.id,
                };

                db.collection("favorites")
                    .add(payload)
                    .then(() => {
                        toastRef.current.show(
                            "Restaurante añadido a favoritos!"
                        );
                        setIsFavorite(true);
                    })
                    .catch(() => {
                        toastRef.current.show(
                            "Error al cargar el restaurante a favoritos"
                        );
                    });
            }
        }
    };

    return (
        <ScrollView vertical style={styles.viewBody}>
            <Loading isVisible={!restaurant ? true : false} text="Cargando" />
            {restaurant && (
                <>
                    <View style={styles.viewFavorite}>
                        <Icon
                            type="material-community"
                            name={isFavorite ? "heart" : "heart-outline"}
                            onPress={() => handleFavorite()}
                            color={isFavorite ? "#f00" : "#000"}
                            size={35}
                            underlayColor="transparent"
                        />
                    </View>
                    <CarouselImg
                        arrayImg={restaurant.images}
                        width={screenWidth}
                        height={250}
                    />
                    <RestaurantBanner
                        name={restaurant.name}
                        description={restaurant.description}
                        rating={rating}
                    />
                    <RestaurantInfo
                        location={restaurant.location}
                        name={restaurant.name}
                        address={restaurant.address}
                    />
                    <ListReviews
                        navigation={navigation}
                        idRestaurant={restaurant.id}
                    />
                </>
            )}
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    );
};

export default Restaurant;

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15,
    },
});

import React, { useState, useRef, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { size } from "lodash";
import Toast from "react-native-easy-toast";

import { firabaseApp, firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
import Loading from "../components/Loading";

const db = firebase.firestore(firebaseApp);

const Favorites = () => {
    const [restaurants, setRestaurants] = useState(null);
    const [isUserLogged, setIsUserLogged] = useState(false);
    const toastRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [reloadFavorites, setReloadFavorites] = useState(null);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setIsUserLogged(true) : setIsUserLogged(false);
    });

    useFocusEffect(
        useCallback(() => {
            if (isUserLogged) {
                const idUser = firebase.auth().currentUser.uid;
                db.collection("favorites")
                    .where("idUser", "==", idUser)
                    .get()
                    .then((res) => {
                        const idRestaurantsArr = [];
                        res.forEach((doc) => {
                            idRestaurantsArr.push(doc.data().idRestaurant);
                        });
                        getRestaurantsData(idRestaurantsArr).then((res) => {
                            const restaurants = [];
                            res.forEach((doc) => {
                                const restaurant = doc.data();
                                restaurant.id = doc.id;
                                restaurants.push(restaurant);
                            });
                            setRestaurants(restaurants);
                        });
                    });
            }
        }, [isUserLogged, reloadFavorites])
    );

    const getRestaurantsData = (idRestaurantsArr) => {
        const arrRestaurants = [];
        idRestaurantsArr.forEach((id) => {
            const res = db.collection("restaurants").doc(id).get();
            arrRestaurants.push(res);
        });
        return Promise.all(arrRestaurants);
    };

    if (!isUserLogged) return <UserNotLogged navigation={navigation} />;
    else if (restaurants?.length === 0) return <NoFavorites />;

    return (
        <View style={styles.viewBody}>
            {restaurants ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => (
                        <Restaurant
                            restaurant={restaurant}
                            setIsLoading={setIsLoading}
                            toastRef={toastRef}
                            setReloadFavorites={setReloadFavorites}
                        />
                    )}
                    keyExtractor={(item, index) => {
                        index.toString();
                    }}
                />
            ) : (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text style={{ textAlign: "center" }}>
                        Cargando restaurantes
                    </Text>
                </View>
            )}
            <Loading text="Eliminando restaurante..." isVisible={isLoading} />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
};

export default Favorites;

const NoFavorites = () => {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                No tienes restaurantes en tu lista
            </Text>
        </View>
    );
};

const UserNotLogged = ({ navigation }) => {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                Necesitas estar logeado para ver esta seccion
            </Text>
            <Button
                title="Ir al login"
                containerStyle={{ marginTop: 20, width: "80%" }}
                buttonStyle={{ backgroundColor: "#006a80" }}
                onPress={() =>
                    navigation.navigate("account", { screen: "login" })
                }
            />
        </View>
    );
};

const Restaurant = ({
    restaurant,
    toastRef,
    setIsLoading,
    setReloadFavorites,
}) => {
    const { name, images, id } = restaurant.item;

    const removeFavoriteConfirmation = () => {
        Alert.alert(
            "Eliminar restaurante de favoritos",
            "Estas seguro de que quieres elminiar el restaurante de tus favoritos?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: removeFavorite },
            ],
            { cancelable: false }
        );
    };
    const removeFavorite = () => {
        setIsLoading(true);
        db.collection("favorites")
            .where("idRestaurant", "==", id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((res) => {
                res.forEach((doc) => {
                    const idFavorite = doc.id;
                    db.collection("favorites")
                        .doc(idFavorite)
                        .delete()
                        .then(() => {
                            toastRef.current.show(
                                "Restaurante eliminado correctamente"
                            );
                            setReloadFavorites((current) => !current);
                        })
                        .catch(() => {
                            toastRef.current.show(
                                "Error al eliminar el restaurante"
                            );
                        });
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    return (
        <View style={styles.restaurant}>
            <TouchableOpacity onPress={() => {}}>
                <Image
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff" />}
                    source={
                        images[0]
                            ? { uri: images[0] }
                            : require("../../assets/img/no-image.png")
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favorite}
                        onPress={() => {
                            removeFavoriteConfirmation();
                        }}
                        underlayColor="transparent"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    viewBody: { flex: 1, backgroundColor: "#f2f2f2" },
    loaderRestaurants: { marginTop: 10, marginBottom: 10 },
    restaurant: {
        margin: 10,
    },
    image: { width: "100%", height: 180 },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: -30,
        backgroundColor: "#fff",
    },
    name: { fontWeight: "bold", fontSize: 30 },
    favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100,
    },
});

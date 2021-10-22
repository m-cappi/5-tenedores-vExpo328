import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";
import Loading from "../../components/Loading";
import CarouselImg from "../../components/CarouselImg";
import RestaurantBanner from "../../components/Restaurants/RestaurantBanner";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

const Restaurant = ({ navigation, route }) => {
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);

    navigation.setOptions({ title: name });

    useEffect(() => {
        db.collection("restaurants")
            .doc(id)
            .get()
            .then((res) => {
                const data = res.data();
                data.id = res.id;
                setRestaurant(data);
                console.log(restaurant);
                setRating(data.rating);
            });
    }, []);

    return (
        <ScrollView vertical style={styles.viewBody}>
            <Loading isVisible={!restaurant ? true : false} text="Cargando" />
            {restaurant && (
                <>
                    <Text>Restaurante Info...</Text>
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
                </>
            )}
        </ScrollView>
    );
};

export default Restaurant;

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

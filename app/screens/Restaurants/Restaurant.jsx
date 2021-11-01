import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
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

    navigation.setOptions({ title: name });

    useEffect(() => {
        db.collection("restaurants")
            .doc(id)
            .get()
            .then((res) => {
                const data = res.data();
                data.id = res.id;
                setRestaurant(data);
                setRating(data.rating);
            });
    }, []);

    return (
        <ScrollView vertical style={styles.viewBody}>
            <Loading isVisible={!restaurant ? true : false} text="Cargando" />
            {restaurant && (
                <>
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
                    setRating={setRating}
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

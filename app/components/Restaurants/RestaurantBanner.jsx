import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Rating } from "react-native-elements";

const RestaurantBanner = ({ name, description, rating }) => {
    return (
        <View style={styles.viewBanner}>
            <View style={{ flexDirection: "column" }}>
                <Text style={styles.restaurantName}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
                <Text style={styles.restaurantDescription}>{description}</Text>
            </View>
        </View>
    );
};

export default RestaurantBanner;

const styles = StyleSheet.create({
    viewBanner: {
        padding: 15,
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: "bold",
    },
    restaurantDescription: {
        marginTop: 5,
        color: "grey",
    },
    rating: {
        position: "absolute",
        right: 0,
    },
});

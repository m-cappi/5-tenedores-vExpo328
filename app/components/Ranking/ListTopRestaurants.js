import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Card, Image, Icon, Rating } from "react-native-elements";

const ListTopRestaurants = ({ restaurants, navigation }) => {
    return (
        <FlatList
            data={restaurants}
            renderItem={(restaurant) => (
                <Restaurant restaurant={restaurant} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

export default ListTopRestaurants;

const Restaurant = ({ restaurant, navigation }) => {
    const [iconColor, setIconColor] = useState("#000");
    const { name, rating, images, description, id } = restaurant.item;

    useEffect(() => {
        if (restaurant.index === 0) {
            setIconColor("#efb819");
        } else if (restaurant.index === 1) {
            setIconColor("#e3e4e5");
        } else if (restaurant.index === 2) {
            setIconColor("#cd7f32");
        }
    }, []);

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("restaurants", {
                    screen: "restaurant",
                    params: { id, name },
                });
            }}
        >
            <Card containerStyle={styles.cardContainer}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.iconContainer}
                />
                <Image
                    style={styles.restaurantImage}
                    resizeMode="cover"
                    source={
                        images[0]
                            ? { uri: images[0] }
                            : require("../../../assets/img/no-image.png")
                    }
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating imageSize={20} startingValue={rating} readonly />
                    <Text style={styles.description}>{description}</Text>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: { marginBottom: 30, borderWidth: 0 },
    iconContainer: { position: "absolute", left: -30, top: -30, zIndex: 2 },
    restaurantImage: { width: "100%", height: 200 },
    titleRating: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
    },
    title: { fontSize: 20, fontWeight: "bold" },
    description: { color: "grey", marginTop: 0, textAlign: "justify" },
});

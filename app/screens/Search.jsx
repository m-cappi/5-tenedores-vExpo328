import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon, Avatar } from "react-native-elements";
import { FireSQL } from "firesql";

//import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

//const db = firebase.firestore(firebaseApp);
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

const Search = ({ navigation }) => {
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
        if (search) {
            fireSQL
                .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
                .then((res) => {
                    setRestaurants(res);
                });
        }
    }, [search]);
    return (
        <View>
            <SearchBar
                placeholder="Busca tu restaurante..."
                onChangeText={(e) => setSearch(e)}
                containerStyle={styles.searchBarContainer}
                value={search}
            />
            {restaurants.length === 0 ? (
                <>
                    <NotFound />
                </>
            ) : (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => (
                        <Restaurant
                            restaurant={restaurant}
                            navigation={navigation}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
};

export default Search;

const NotFound = () => {
    return (
        <View style={styles.notFound}>
            <Image
                source={require("../../assets/img/no-result-found.png")}
                resizeMode="cover"
                style={styles.notFoundImage}
            />
        </View>
    );
};

const Restaurant = ({ restaurant, navigation }) => {
    const { id, name, images } = restaurant.item;
    return (
        <ListItem
            bottomDivider
            onPress={() =>
                navigation.navigate("restaurants", {
                    screen: "restaurant",
                    params: { id, name },
                })
            }
        >
            <Avatar
                source={
                    images[0]
                        ? { uri: images[0] }
                        : require("../../assets/img/no-image.png")
                }
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
                <ListItem.Chevron />
            </ListItem.Content>
        </ListItem>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: { marginBottom: 20 },
    notFound: { flex: 1, alignItems: "center" },
    notFoundImage: { height: 200, width: 200 },
});

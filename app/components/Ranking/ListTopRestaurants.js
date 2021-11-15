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
    const { name, rating } = restaurant.item;
    return (
        <View>
            <Text>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({});

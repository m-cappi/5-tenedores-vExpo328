import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import Map from "../Map";

const RestaurantInfo = ({ location, name, address }) => {
    const infoList = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null,
        },
        {
            text: "111 222 333",
            iconName: "phone",
            iconType: "material-community",
            action: null,
        },
        {
            text: "restaurantName@mail.com",
            iconName: "at",
            iconType: "material-community",
            action: null,
        },
    ];
    return (
        <View style={styles.viewRestaurantInfo}>
            <Text stye={styles.restaurantInfoTitle}>
                Informacion sobre el restaurante:
            </Text>
            <Map location={location} name={name} height={100} />
            {map(infoList, (item, index) => (
                <ListItem key={index} containerStyle={styles.listItemContainer}>
                    <Icon
                        type={item.iconType}
                        name={item.iconName}
                        color="#00a680"
                    />
                    <ListItem.Content>
                        <ListItem.Title>{item.text}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))}
        </View>
    );
};

export default RestaurantInfo;

const styles = StyleSheet.create({
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25,
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    listItemContainer: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1,
    },
});

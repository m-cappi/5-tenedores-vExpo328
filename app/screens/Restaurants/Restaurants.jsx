import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import firebase from "firebase/app";
// import { firebaseApp } from "../../utils/firebase";

const Restaurants = ({ navigation }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
        });
    }, []);

    return (
        <View style={styles.viewBody}>
            <Text>Restaurants...</Text>
            {user && (
                <Icon
                    type="material-community"
                    name="plus"
                    reverse
                    color="#00a680"
                    containerStyle={styles.btnContainer}
                    raised={true}
                    onPress={() => navigation.navigate("addRestaurant")}
                />
            )}
        </View>
    );
};

export default Restaurants;

const styles = StyleSheet.create({
    viewBody: { flex: 1, backgroundColor: "#fff" },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "#212121",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
    },
});

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";

const AddRestaurantReview = ({ navigation, route }) => {
    const { idRestaurant } = route.params;

    return (
        <View style={styles.viewBody}>
            <Text>AddRestaurantReview...</Text>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={[
                        "Pesimo",
                        "Deficiente",
                        "Normal",
                        "Muy Bueno",
                        "Excelente",
                    ]}
                    defaultRating={0}
                    size={35}
                />
            </View>
            <View style={styles.formReview}>
                <Input placeholder="Titulo" style={styles.input} />
                <Input
                    placeholder="Describe tu experiencia"
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    //style={styles.input}
                />
                <Button
                    title="Envia tu comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                />
            </View>
        </View>
    );
};

export default AddRestaurantReview;

const styles = StyleSheet.create({
    viewBody: { flex: 1 },
    viewRating: { height: 110, backgroundColor: "#f2f2f2" },
    formReview: { flex: 1, alignItems: "center", margin: 10, marginTop: 40 },
    input: { marginBottom: 10 },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%",
    },
    btn: {
        color: "#00a680",
    },
});

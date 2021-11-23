import React, { useState, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import firebase from "firebase/app";
import { firebaseApp } from "../../utils/firebase";
import "firebase/firestore";
import Loading from "../../components/Loading";

const db = firebase.firestore(firebaseApp);

const AddRestaurantReview = ({ navigation, route }) => {
    const { idRestaurant } = route.params;

    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const toastRef = useRef();

    const handleSubmit = () => {
        if (!rating) toastRef.current.show("No has dado ninguna puntuacion");
        else if (!title) toastRef.current.show("El titulo es obligatorio");
        else if (!review) toastRef.current.show("El comentario es obligatorio");
        else {
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createdAt: new Date(),
            };
            db.collection("reviews")
                .add(payload)
                .then(() => {
                    updateRestaurant();
                })
                .catch(() => {
                    toastRef.current.show("Error al enviar la review", 3000);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const updateRestaurant = () => {
        const restaurantRef = db.collection("restaurants").doc(idRestaurant);

        restaurantRef.get().then((res) => {
            const restaurantData = res.data();

            const ratingTotal = restaurantData.ratingTotal + rating;
            const quantityVoting = restaurantData.quantityVoting + 1;
            const newRating = ratingTotal / quantityVoting;

            restaurantRef
                .update({
                    rating: newRating,
                    ratingTotal: ratingTotal,
                    quantityVoting: quantityVoting,
                })
                .then(() => {
                    navigation.goBack();
                });
        });
    };

    return (
        <ScrollView style={styles.viewBody}>
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
                    onFinishRating={(value) => setRating(value)}
                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder="Titulo"
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                    style={styles.input}
                />
                <Input
                    placeholder="Describe tu experiencia..."
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e) => setReview(e.nativeEvent.text)}
                />
                <Button
                    title="Envia tu comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={handleSubmit}
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Enviando comentario" />
        </ScrollView>
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

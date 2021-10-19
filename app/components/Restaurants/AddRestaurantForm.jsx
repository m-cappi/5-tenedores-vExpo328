import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Dimensions,
} from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { map, size, filter, stubArray } from "lodash";
import Modal from "../Modal";

const screenWidth = Dimensions.get("window").width;

const AddRestaurantForm = ({ toastRef, setIsLoading, navigation }) => {
    const [restaurant, setRestaurant] = useState(restaurantDefaultForm());
    const [restaurantGallery, setRestaurantGallery] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const handleSubmit = () => {
        console.log("Ok!");
        console.log(restaurantGallery);
    };
    return (
        <ScrollView style={styles.scrollView}>
            <RestaurantBannerImg bannerImg={restaurantGallery[0]} />
            <FormAdd
                setRestaurant={setRestaurant}
                setIsVisibleMap={setIsVisibleMap}
            />
            <ImageAdd
                toastRef={toastRef}
                setRestaurantGallery={setRestaurantGallery}
                restaurantGallery={restaurantGallery}
            />
            <Button
                title="Crear Restaurante"
                onPress={handleSubmit}
                buttonStyle={styles.btn}
            />
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                toastRef={toastRef}
            />
        </ScrollView>
    );
};

const restaurantDefaultForm = () => {
    return { name: "", address: "", description: "" };
};

export default AddRestaurantForm;

const RestaurantBannerImg = ({ bannerImg }) => {
    return (
        <View style={styles.viewBannerImg}>
            <Image
                source={
                    bannerImg
                        ? { uri: bannerImg }
                        : require("../../../assets/img/no-image.png")
                }
                style={{ width: screenWidth, height: 200 }}
            />
        </View>
    );
};

const FormAdd = ({ setRestaurant, setIsVisibleMap }) => {
    const handleChange = (e, type) => {
        setRestaurant((actual) => {
            return { ...actual, [type]: e.nativeEvent.text };
        });
    };
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                style={styles.input}
                onChange={(e) => handleChange(e, "name")}
            />
            <Input
                placeholder="Direccion"
                style={styles.input}
                onChange={(e) => handleChange(e, "address")}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: "#c2c2c2",
                    onPress: () =>
                        setIsVisibleMap((currentState) => !currentState),
                }}
            />
            <Input
                placeholder="Descripcion del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => handleChange(e, "description")}
            />
        </View>
    );
};

const Map = ({ isVisibleMap, setIsVisibleMap, toastRef }) => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const resPermissions = await Permissions.askAsync(
                Permissions.LOCATION_FOREGROUND
            );
            const statusPermissions =
                resPermissions.permissions.locationForeground.status;

            if (statusPermissions !== "granted")
                toastRef.current.show(
                    "Tienes que aceptar los permisos de localizacion para crear un restaurante.",
                    3000
                );
            else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
            }
        })();
    }, []);

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            draggable
                        />
                    </MapView>
                )}
            </View>
            <Text>Mapa2.0</Text>
        </Modal>
    );
};

const ImageAdd = ({ toastRef, setRestaurantGallery, restaurantGallery }) => {
    const imgSelect = async () => {
        //toastRef.current.show("Seleccionando Imagenes...");
        const resPermissions = await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY
        );

        if (resPermissions === "denied")
            toastRef.current.show(
                "Es necesario aceptar los permisos de galeria. Si los has rechazado, tienes que ir a ajustes de aplicaciones y activarlos manualmente",
                4000
            );
        else {
            const res = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            //console.log(JSON.stringify(res));
            if (res.cancelled) {
                toastRef.current.show(
                    "Has cerrado la galeria sin seleccionar ninguna imagen",
                    3000
                );
            } else {
                setRestaurantGallery((actual) => {
                    return [...actual, res.uri];
                });
            }
        }
    };

    const removeImg = async (imgToRemove) => {
        Alert.alert(
            "Eliminar Imagen",
            "Estas seguro de querer eliminar la imagen?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setRestaurantGallery((currentGallery) =>
                            filter(
                                currentGallery,
                                (imgUrl) => imgUrl !== imgToRemove
                            )
                        );
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.imagesView}>
            {size(restaurantGallery) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.iconContainer}
                    onPress={imgSelect}
                />
            )}
            {map(restaurantGallery, (img, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{ uri: img }}
                    onPress={() => removeImg(img)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: { marginHorizontal: 10 },
    input: { marginBottom: 10 },
    textArea: { height: 100, width: "100%", padding: 0, margin: 0 },
    btn: { backgroundColor: "#00a680", margin: 20 },
    imagesView: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30,
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 70,
        width: 70,
        marginRight: 10,
        backgroundColor: "#e3e3e3",
    },
    miniatureStyle: { width: 70, height: 70, marginRight: 10 },
    viewBannerImg: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    mapStyle: {
        width: "100%",
        height: 550,
    },
});

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
import uuid from "random-uuid-v4";
import Modal from "../Modal";

const screenWidth = Dimensions.get("window").width;

const AddRestaurantForm = ({ toastRef, setIsLoading, navigation }) => {
    const [restaurant, setRestaurant] = useState(restaurantDefaultForm());
    const [restaurantGallery, setRestaurantGallery] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const handleSubmit = () => {
        if (!restaurant.name || !restaurant.address || !restaurant.description)
            toastRef.current.show(
                "Todos los campos del formulario son obligatorios!",
                3000
            );
        else if (size(restaurantGallery) === 0)
            toastRef.current.show(
                "El restaurante tiene que tener al menos una foto",
                3000
            );
        else if (!locationRestaurant)
            toastRef.current.show(
                "Tienes que ubicar el restaurante en el mapa",
                3000
            );
        else {
            setIsLoading(true);
            console.log("Ok!");
            uploadImgStorage().then((res) => {
                console.log(res);
                setIsLoading(false);
            });
        }
    };

    const uploadImgStorage = async () => {
        const imgBlob = [];
        
        await Promise.all(
            map(restaurantGallery, async (img) => {
                const res = await fetch(img);
                const blob = await res.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`restaurants/${result.metadata.name}`)
                        .getDownloadURL()
                        .then((photoUrl) => {
                            imgBlob.push(photoUrl);
                        });
                });
            })
        );

        return imgBlob;
    };

    return (
        <ScrollView style={styles.scrollView}>
            <RestaurantBannerImg bannerImg={restaurantGallery[0]} />
            <FormAdd
                setRestaurant={setRestaurant}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
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
                setLocationRestaurant={setLocationRestaurant}
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

const FormAdd = ({ setRestaurant, setIsVisibleMap, locationRestaurant }) => {
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
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
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

const Map = ({
    isVisibleMap,
    setIsVisibleMap,
    toastRef,
    setLocationRestaurant,
}) => {
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

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localizacion guardada correctamente!");
        setIsVisibleMap(false);
    };

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
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
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
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
    },
    viewMapBtnCancel: { backgroundColor: "#a60d0d" },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680",
    },
});

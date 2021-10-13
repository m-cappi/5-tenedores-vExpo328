import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Accessory } from "react-native-elements";
import firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const InfoUser = ({
    userInfo: { uid, photoURL, displayName, email },
    toastRef,
    setLoading,
    setLoadingText,
}) => {
    
    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY //CAMERA_ROLL
        );

        //console.log(resultPermission);
        const resultPermissionCamera =
            resultPermission.permissions.mediaLibrary.status;
        if (resultPermissionCamera === "denied") {
            toastRef.current.show(
                "Es necesario aceptar los permisos de la galeria"
            );
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (result.cancelled) {
                toastRef.current.show("Has cerrado la seleccion de imagenes");
            } else {
                setLoadingText("Actualizando tu avatar");
                setLoading(true);
                uploadImage(result.uri)
                    .then(() => {
                        console.log("Imagen subida");
                        updatePhotoUrl();
                    })
                    .catch(() => {
                        toastRef.current.show("Error al actualizar el avatar");
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        }
    };

    const uploadImage = async (uri) => {
        const response = await fetch(uri);
        //console.log(JSON.stringify(response))
        const blob = await response.blob();
        //console.log(JSON.stringify(blob))
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    };

    const updatePhotoUrl = () => {
        firebase
            .storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async (res) => {
                const update = {
                    photoURL: res,
                };
                //console.log(update);
                await firebase.auth().currentUser.updateProfile(update);
            })
            .catch(() => {
                toastRef.current.show("Error al actualizar el avatar");
            });
    };

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                showEditButton
                containerStyle={styles.avatarContainer}
                source={
                    photoURL
                        ? { uri: photoURL }
                        : require("../../../assets/img/avatar-default.jpg")
                }
            >
                <Accessory onPress={changeAvatar} size={25} />
            </Avatar>
            <View>
                <Text style={styles.userName}>
                    {displayName ? displayName : "Anonymous"}
                </Text>
                <Text>{email ? email : "Social login"}</Text>
            </View>
        </View>
    );
};

export default InfoUser;

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingVertical: 30,
    },
    avatarContainer: {
        marginRight: 20,
        backgroundColor: "#f00",
    },
    userName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
});

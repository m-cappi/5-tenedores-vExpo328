import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Accessory } from "react-native-elements";
import firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const InfoUser = ({ userInfo: { photoURL, displayName, email }, toastRef }) => {
    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY //CAMERA_ROLL
        );

        console.log(resultPermission);
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
            console.log(result);
        }
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

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
// import * as firebase from "firebase";
import firebase from "firebase";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";

const UserLogged = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const toastRef = useRef();
    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })(); //funcion autoejecutable
    }, []);
    return (
        <View style={styles.viewUserInfo}>
            {userInfo && (
                <InfoUser
                    userInfo={userInfo}
                    toastRef={toastRef}
                    setLoading={setLoading}
                    setLoadingText={setLoadingText}
                />
            )}
            <Text>Account Options...</Text>
            <Button
                title="Cerrar sesion"
                buttonStyle={styles.btnLogout}
                titleStyle={styles.btnLogoutText}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={loading} text={loadingText} />
        </View>
    );
};

export default UserLogged;

const styles = StyleSheet.create({
    viewUserInfo: { minHeight: "100%", backgroundColor: "#f2f2f2" },
    btnLogout: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnLogoutText: { color: "#00a680" },
});

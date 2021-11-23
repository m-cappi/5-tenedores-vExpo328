import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
//import * as firebase from "firebase";
import firebase from "firebase";
import { Button, Input, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { size, isEmpty } from "lodash";
import { validateEmail } from "../../utils/validations";
import Loading from "../Loading";

const LoginForm = ({ toastRef }) => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    }); //dejarlo como {} para produccion
    const [hidePassword, setHidePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleChange = (e, type) => {
        setLoginData({ ...loginData, [type]: e.nativeEvent.text });
    };

    const handleSubmit = () => {
        if (isEmpty(loginData.email) || isEmpty(loginData.password))
            toastRef.current.show("Todos los campos son obligatorios!");
        else if (!validateEmail(loginData.email))
            toastRef.current.show("El email no es valido!");
        else if (size(loginData.password) < 6) {
            toastRef.current.show(
                "La contraseña debe contener al menos 6 caracteres!"
            );
        } else {
            setLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(loginData.email, loginData.password)
                .then((res) => {
                    navigation.navigate("account");
                })
                .catch((err) => {
                    toastRef.current.show("Credenciales invalidas!");
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Tu email"
                containerStyle={styles.inputForm}
                onChange={(e) => handleChange(e, "email")}
                value={loginData.email}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                password={true}
                secureTextEntry={hidePassword}
                containerStyle={styles.inputForm}
                onChange={(e) => handleChange(e, "password")}
                value={loginData.password}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        onPress={() => setHidePassword(!hidePassword)}
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Button
                title="Inicia sesion"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={handleSubmit}
            />
            <Loading isVisible={loading} text="Iniciando tu sesion" />
        </View>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: { width: "100%", marginTop: 20 },
    btnContainerLogin: { marginTop: 20, width: "95%" },
    btnLogin: { backgroundColor: "#00a680" },
    iconRight: { color: "#c1c1c1" },
});

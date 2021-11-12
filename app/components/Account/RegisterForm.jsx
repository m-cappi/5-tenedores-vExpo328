import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { size, isEmpty } from "lodash";
//import * as firebase from "firebase";
import firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import { validateEmail } from "../../utils/validations";
import Loading from "../Loading";

const RegisterForm = ({ toastRef }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    //console.log(firebase);
    const handleSubmit = () => {
        if (
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.confirmPassword)
        ) {
            toastRef.current.show("Todos los campos son obligatorios!");
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show("El email no es valido!");
        } else if (formData.password !== formData.confirmPassword) {
            toastRef.current.show("Las contraseñas deben ser iguales!");
        } else if (size(formData.password) < 6) {
            toastRef.current.show(
                "La contraseña debe contener al menos 6 caracteres!"
            );
        } else {
            setLoading(true);
            toastRef.current.show("Loading...");
            firebase
                .auth()
                .createUserWithEmailAndPassword(
                    formData.email,
                    formData.password
                )
                .then((res) => {
                    //setLoading(false);
                    navigation.navigate("account");
                })
                .catch((err) => {
                    toastRef.current.show(
                        "El email ya se encuentra registrado!"
                    );
                })
                .finally(() => setLoading(false));
        }
    };

    const handleChange = (event, type) => {
        setFormData({ ...formData, [type]: event.nativeEvent.text });
    };

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => handleChange(e, "email")}
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
                secureTextEntry={showPassword ? false : true}
                containerStyle={styles.inputForm}
                onChange={(e) => handleChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => {
                            setShowPassword(!showPassword);
                        }}
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Confirme su contraseña"
                password={true}
                secureTextEntry={showPassword ? false : true}
                containerStyle={styles.inputForm}
                onChange={(e) => handleChange(e, "confirmPassword")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => {
                            setShowPassword((actual) => !actual);
                        }}
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Button
                title="Unite"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={handleSubmit}
            />
            <Loading isVisible={loading} text="Creando cuenta" />
        </View>
    );
};

export default RegisterForm;

const defaultFormValue = () => {
    return { email: "", password: "", confirmPassword: "" };
};

//el flex del formContainer anda gracias al KeyboardAwareScrollView de Register x alguna fucking razon... con View comunacho se veia todo roto
const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 3,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1",
    },
});

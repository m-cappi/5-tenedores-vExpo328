import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { isEmpty, size } from "lodash";
import firebase from "firebase";
import { reauthenticate } from "../../utils/api";

const PasswordChangeForm = ({ setShowModal, toastRef }) => {
    const [formData, setFormData] = useState(defaultForm());
    const [hidePassword, setHidePassword] = useState(true);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(null);

    const handleChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    };
    const handleSubmit = async () => {
        setErrors({});
        console.log(formData);
        if (isEmpty(formData.password)) {
            setErrors({ password: "La contraseña actual es necesaria!" });
        } else if (
            isEmpty(formData.newPassword) ||
            formData.newPassword === formData.password
        ) {
            setErrors({ newPassword: "La contraseña no ha cambiado!" });
        } else if (formData.newPassword !== formData.confirmPassword) {
            setErrors({
                newPassword: "Las contraseñas no son iguales!",
                confirmPassword: "Las contraseñas no son iguales!",
            });
        } else if (size(formData.newPassword) < 6) {
            setErrors({
                newPassword:
                    "La contraseña debe contener al menos 6 caracteres!",
            });
        } else {
            setLoading(true);
            await reauthenticate(formData.password)
                .then(async () => {
                    await firebase
                        .auth()
                        .currentUser.updatePassword(formData.newPassword)
                        .then(() => {
                            setLoading(false);
                            toastRef.current.show(
                                "Contraseña actualizada con exito!"
                            );
                            setShowModal(false);
                            firebase.auth().signOut();
                        })
                        .catch((err) => {
                            setLoading(false);
                            console.log(err);
                            setErrors({
                                other: "Error al actualizar la contraseña!",
                            });
                        });
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err);
                    setErrors({ password: "La contraseña no es valida!" });
                });
        }
        //setLoading(false);
    };

    return (
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hidePassword}
                onChange={(e) => handleChange(e, "password")}
                errorMessage={errors.password}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        color="#c2c2c2"
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                }
            />
            <Input
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hidePassword}
                onChange={(e) => handleChange(e, "newPassword")}
                errorMessage={errors.newPassword}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        color="#c2c2c2"
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                }
            />
            <Input
                placeholder="Confirme la contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hidePassword}
                onChange={(e) => handleChange(e, "confirmPassword")}
                errorMessage={errors.confirmPassword}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        color="#c2c2c2"
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                }
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={handleSubmit}
                loading={loading}
            />
            {errors.other && <Text>{errors.other}</Text>}
        </View>
    );
};

export default PasswordChangeForm;

const defaultForm = () => {
    return { password: "", newPassword: "", confirmPassword: "" };
};

const styles = StyleSheet.create({
    view: { alignItems: "center", paddingVertical: 10 },
    input: { marginBottom: 10 },
    btnContainer: { marginTop: 20, width: "95%" },
    btn: { backgroundColor: "#00a680" },
});

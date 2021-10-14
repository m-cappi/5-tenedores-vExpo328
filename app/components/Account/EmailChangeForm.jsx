import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { isEmpty } from "lodash";
import firebase from "firebase";
import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

const EmailChangeForm = ({ email, setShowModal, setReloadUser, toastRef }) => {
    const [formData, setFormData] = useState(defaultForm());
    const [hidePassword, setHidePassword] = useState(true);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState();

    const handleChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    };

    const handleSubmit = () => {
        setErrors({});
        //console.log(formData);
        if (isEmpty(formData.email) || email === formData.email)
            setErrors({ email: "El Email no ha cambiado!" });
        else if (!validateEmail(formData.email))
            setErrors({ email: "El Email no es valido!" });
        else if (isEmpty(formData.password))
            setErrors({ password: "La contraseña no puede estar vacia!" });
        else {
            setLoading(true);
            reauthenticate(formData.password)
                .then((res) => {
                    firebase
                        .auth()
                        .currentUser.updateEmail(formData.email)
                        .then(() => {
                            setLoading(false);
                            toastRef.current.show(
                                "Tu Email se ha actualizado correctamente!"
                            );
                            setReloadUser(true);
                            setShowModal(false);
                        })
                        .catch(() => {
                            setErrors({
                                email: "Error al actualizar el Email",
                            });
                            setLoading(false)
                        });
                })
                .catch(() => {
                    setLoading(false);
                    setErrors({ password: "La contraseña es invalida!" });
                });
        }
    };

    return (
        <View style={styles.view}>
            <Input
                placeholder="Correo electronico"
                defaultValue={email || ""}
                rightIcon={
                    <Icon type="material-community" name="at" color="#c2c2c2" />
                }
                containerStyle={styles.input}
                onChange={(e) => handleChange(e, "email")}
                errorMessage={errors.email}
            />
            <Input
                placeholder="Contraseña"
                password={true}
                secureTextEntry={hidePassword}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        color="#c2c2c2"
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                }
                containerStyle={styles.input}
                onChange={(e) => handleChange(e, "password")}
                errorMessage={errors.password}
            />
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={handleSubmit}
                loading={loading}
            />
        </View>
    );
};

export default EmailChangeForm;

const defaultForm = () => {
    return { email: "", password: "" };
};

const styles = StyleSheet.create({
    view: { alignItems: "center", paddingVertical: 10 },
    input: { marginBottom: 10 },
    btnContainer: { marginTop: 20, width: "95%" },
    btn: { backgroundColor: "#00a680" },
});

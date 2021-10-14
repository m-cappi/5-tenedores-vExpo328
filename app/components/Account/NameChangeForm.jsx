import { isEmpty } from "lodash";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import firebase from "firebase";

const NameChangeForm = ({ displayName, setShowModal, setReloadUser }) => {
    const [newName, setNewName] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = () => {
        setError(null);
        if (isEmpty(newName)) setError("El nombre no puede estar vacio.");
        else if (newName === displayName)
            setError("El nombre no puede ser igual al actual.");
        else {
            setLoading(true);
            const update = { displayName: newName };
            firebase
                .auth()
                .currentUser.updateProfile(update)
                .then(() => {
                    setReloadUser(true);
                    setLoading(false);
                    setShowModal(false);
                })
                .catch(() => {
                    setError("Ha habido un error al actualizar tu nombre!");
                    setLoading(false);
                });
        }
    };
    return (
        <View style={styles.view}>
            <Input
                placeholder="Nombre y Apellido"
                style={styles.input}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="account-circle-outline"
                        color="#c2c2c2"
                    />
                }
                onChange={(e) => setNewName(e.nativeEvent.text)}
                defaultValue={displayName || ""}
                errorMessage={error}
            />
            <Button
                title="Cambiar Nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={handleSubmit}
                loading={loading}
            />
        </View>
    );
};

export default NameChangeForm;

const styles = StyleSheet.create({
    view: { alignItems: "center", paddingVertical: 10 },
    input: { marginBottom: 10 },
    btnContainer: { marginTop: 20, width: "95%" },
    btn: { backgroundColor: "#00a680" },
});

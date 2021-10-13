import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import Modal from "../Modal";

const AccountOptions = ({
    userInfo: { uid, photoURL, displayName, email },
    toastRef,
    setLoading,
    setLoadingText,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(<Text>Cambiando Nombre y Apellidos</Text>);
                setShowModal(true);
                break;

            case "email":
                setRenderComponent(<Text>Cambiando Email</Text>);
                setShowModal(true);
                break;

            case "password":
                setRenderComponent(<Text>Cambiando Contraseña</Text>);
                setShowModal(true);
                break;

            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    };
    const menuOptions = generateOptions(selectedComponent);

    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem
                    key={index}
                    bottomDivider
                    // containerStyle={styles.menuItem}
                    onPress={menu.onPress}
                >
                    <Icon
                        type={menu.iconType}
                        name={menu.iconNameLeft}
                        color={menu.iconColorLeft}
                    />
                    <ListItem.Content>
                        <ListItem.Title>{menu.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                    {/* <Icon
                        type={menu.iconType}
                        name={menu.iconNameRight}
                        color={menu.iconColorRight}
                    /> */}
                </ListItem>
            ))}
            {renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            )}
        </View>
    );
};

export default AccountOptions;

const generateOptions = (callback) => {
    return [
        {
            title: "Cambiar Nombre y Apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconColorRight: "#ccc",
            iconNameRight: "chevron-right",
            onPress: () => callback("displayName"),
        },
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconColorRight: "#ccc",
            iconNameRight: "chevron-right",
            onPress: () => callback("email"),
        },
        {
            title: "Cambiar Contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconColorRight: "#ccc",
            iconNameRight: "chevron-right",
            onPress: () => callback("password"),
        },
    ];
};

const styles = StyleSheet.create({
    menuItem: { borderBottomWidth: 1, borderBottomColor: "#e3e3e3" },
});

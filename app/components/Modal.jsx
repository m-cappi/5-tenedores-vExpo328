import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Overlay } from "react-native-elements";

const Modal = ({ isVisible, setIsVisible, children }) => {
    const toggleModal = () => setIsVisible((actual) => !actual);
    return (
        <Overlay
            isVisible={isVisible}
            fullScreen={false}
            overlayStyle={styles.overlay}
            backdropStyle={styles.backdrop}
            onBackdropPress={toggleModal}
        >
            {children}
        </Overlay>
    );
};

export default Modal;

const styles = StyleSheet.create({
    overlay: { backgroundColor: "#fff", height: "auto", width: "90%" },
    backdrop: { backgroundColor: "rgba(0,0,0,0.5)" },
});

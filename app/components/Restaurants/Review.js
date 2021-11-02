import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Rating } from "react-native-elements";

const Review = ({
    review: { title, review, rating, createdAt, avatarUser },
}) => {
    const reviewDate = new Date(createdAt.seconds * 1000);
    return (
        <View style={styles.viewReview}>
            <View style={styles.viewAvatar}>
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.avatarContainer}
                    source={
                        avatarUser
                            ? { uri: avatarUser }
                            : require("../../../assets/img/avatar-default.jpg")
                    }
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.review}>{review}</Text>
                <Rating imageSize={15} startingValue={rating} readonly />
                <Text style={styles.date}>
                    {reviewDate.getDate()}/{reviewDate.getMonth() + 1}/
                    {reviewDate.getFullYear()} - {reviewDate.getHours()}:
                    {reviewDate.getMinutes() < 10 ? "0" : ""}
                    {reviewDate.getMinutes()}
                </Text>
            </View>
        </View>
    );
};

export default Review;

const styles = StyleSheet.create({
    viewReview: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1,
    },
    viewAvatar: { marginRight: 15 },
    avatarContainer: {
        width: 50,
        height: 50,
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start",
    },
    title: {
        fontWeight: "bold",
    },
    review: {
        paddingTop: 2,
        color: "grey",
        marginBottom: 5,
    },
    date: {
        marginTop: 5,
        color: "grey",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0,
    },
});

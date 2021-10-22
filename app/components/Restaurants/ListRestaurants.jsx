import React from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";

const ListRestaurants = ({ restaurants, isLoading, handleLoadMore }) => {
    const navigation = useNavigation();
    return (
        <View>
            {!isEmpty(restaurants) ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => (
                        <Restaurant
                            restaurant={restaurant}
                            navigation={navigation}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={<ListFooter isLoading={isLoading} />}
                />
            ) : (
                <View style={styles.loadingRestaurants}>
                    <ActivityIndicator size="large" color="#212121" />
                    <Text>Cargando Restaurantes...</Text>
                </View>
            )}
        </View>
    );
};

export default ListRestaurants;

const Restaurant = ({ restaurant, navigation }) => {
    const { id, images, name, address, description } = restaurant.item;

    const goRestaurant = () => {
        navigation.navigate("restaurant", {
            id,
            name,
        });
    };
    return (
        <TouchableOpacity onPress={() => goRestaurant()}>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImg}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={
                            <ActivityIndicator color="#212121" />
                        }
                        source={
                            !isEmpty(images)
                                ? { uri: images[0] }
                                : require("../../../assets/img/no-image.png")
                        }
                        style={styles.imgRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>
                        {description.substr(0, 60)}...
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const ListFooter = ({ isLoading }) => {
    return (
        <>
            {isLoading ? (
                <View style={styles.loadingRestaurants}>
                    <ActivityIndicator size="large" color="#212121" />
                </View>
            ) : (
                <View style={styles.endOfList}>
                    <Text>No quedan restaurantes por cargar</Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    loadingRestaurants: { marginVertical: 10, alignItems: "center" },
    viewRestaurant: { flexDirection: "row", margin: 10 },
    viewRestaurantImg: { marginRight: 15 },
    imgRestaurant: { width: 80, height: 80 },
    restaurantName: { fontWeight: "bold" },
    restaurantAddress: { paddingTop: 2, color: "grey" },
    restaurantDescription: { paddingTop: 2, color: "grey", width: 300 },
    endOfList: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    },
});

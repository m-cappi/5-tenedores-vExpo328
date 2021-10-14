import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/Restaurants/Restaurants";
import AddRestaurant from "../screens/Restaurants/AddRestaurant";

const Stack = createStackNavigator();

const RestaurantsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{ title: "Restaurantes" }}
            />
            <Stack.Screen
                name="addRestaurant"
                component={AddRestaurant}
                options={{ title: "Añadir un nuevo Restaurante" }}
            />
        </Stack.Navigator>
    );
};

export default RestaurantsStack;

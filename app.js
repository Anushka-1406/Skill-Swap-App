import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AccountScreen from "./screens/AccountScreen";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { auth } from "./firebaseconfig";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Skill Swap",
            headerRight: () => (
              <View style={{ flexDirection: "row", marginRight: 20 }}>
                <Ionicons
                  name="person-circle-outline"
                  size={28}
                  color="#333"
                  style={{ marginRight: 20 }}
                  onPress={() => navigation.navigate("Account")}
                />
                <Ionicons
                  name="log-out-outline"
                  size={28}
                  color="#333"
                  onPress={async () => {
                    await auth.signOut();
                    navigation.navigate("Login");
                  }}
                />
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DashboardScreen from "./screens/DashboardScreen";
import TasksScreen from "./screens/TasksScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ForumScreen from "./screens/ForumScreen";
import "./localization/i18n";
import HomeScreen from "./screens/HomeScreen";
import StorybookScreen from "./components/StorybookScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Den") {
            iconName = focused ? "paw" : "paw-outline";
          } else if (route.name === "Quests") {
            iconName = focused ? "treasure-chest" : "treasure-chest";
          } else if (route.name === "Leaderboard") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "Forum") {
            iconName = focused
              ? "comment-multiple"
              : "comment-multiple-outline";
          } else {
            iconName = "unknown";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#519872", // main pastel green
        tabBarInactiveTintColor: "#3E8E6E", // darker pastel green
        headerStyle: {
          backgroundColor: "#519872", // main pastel green header
        },
        headerTintColor: "#ffffff", // white text
      })}
    >
      <Tab.Screen name="Den" component={DashboardScreen} />
      <Tab.Screen name="Quests" component={HomeScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => <TabNavigator />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {() => <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
        <Stack.Screen
          name="Dino Library"
          component={StorybookScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#519872", // Green color
            },
            headerTintColor: "#fff", // White text color
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

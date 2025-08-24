import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen"; 
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AssignmentAudioScreen from "./screens/AssignmentAudioScreen";
import AssignmentFileScreen from "./screens/AssignmentFileScreen";
import "./localization/i18n";
import { DefaultTheme, PaperProvider } from "react-native-paper";

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  AssignmentAudio: { ass_id: number };
  AssignmentFile: { ass_id: number };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Tasks") {
            iconName = focused ? "format-list-checks" : "format-list-checkbox";
          } else if (route.name === "Leaderboard") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          } else {
            iconName = "help-circle-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#6200EE",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#6200EE",
        },
        headerTintColor: "#fff",
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: "DinoPhonics" }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={HomeScreen}
        options={{ title: "Tasks" }}
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ title: "Leaderboard" }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for testing

  const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
      ...DefaultTheme.colors,
      myOwnColor: "#BADA55",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <React.Fragment>
              <Stack.Screen 
                name="Main" 
                component={TabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AssignmentAudio"
                component={AssignmentAudioScreen}
                options={{ 
                  title: "Assignment Details",
                  headerStyle: {
                    backgroundColor: "#6200EE",
                  },
                  headerTintColor: "#fff",
                }}
              />
              <Stack.Screen
                name="AssignmentFile"
                component={AssignmentFileScreen}
                options={{ 
                  title: "Assignment Details",
                  headerStyle: {
                    backgroundColor: "#6200EE",
                  },
                  headerTintColor: "#fff",
                }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Stack.Screen 
                name="Login"
                options={{ headerShown: false }}
              >
                {() => <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false }}
              />
            </React.Fragment>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
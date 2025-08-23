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
  AssignmentFile: { ass_id: number }
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Dashboard") {
            iconName = focused ? "view-dashboard" : "view-dashboard-outline";
          } else if (route.name === "Tasks") {
            iconName = focused ? "format-list-checks" : "format-list-checkbox";
          } else if (route.name === "Leaderboard") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          } else {
            iconName = "unknown";
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Source of truth for our design theme
  const theme = {
    ...DefaultTheme,
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
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
            <>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {() => <TabNavigator />}
            </Stack.Screen>

            <Stack.Screen
              name="AssignmentAudio"
              component={AssignmentAudioScreen}
              options={{ title: "Assignment Details" }}
            />

            <Stack.Screen
              name="AssignmentFile"
              component={AssignmentFileScreen}
              options={{ title: "Assignment Details" }}
            />
            </>
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
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

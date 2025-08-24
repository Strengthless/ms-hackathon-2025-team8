import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import DashboardScreen from './screens/DashboardScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import ProfileScreen from './screens/ProfileScreen'
import AssignmentAudioScreen from './screens/AssignmentAudioScreen'
import AssignmentFileScreen from './screens/AssignmentFileScreen'
import HomeScreen from './screens/HomeScreen'
import StorybookScreen from './components/StorybookScreen'
import ForumScreen from './screens/ForumScreen'
import { Task } from './constants/mockData'
import './localization/i18n'
import { DefaultTheme, PaperProvider } from 'react-native-paper'

export type RootStackParamList = {
    Main: undefined
    Login: undefined
    Signup: undefined
    AssignmentAudio: { task: Task }
    AssignmentFile: { task: Task }
    'Dino Library': undefined
}

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string

                    if (route.name === 'Profile') {
                        iconName = focused ? 'paw' : 'paw-outline'
                    } else if (route.name === 'Quest') {
                        iconName = focused ? 'map-marker' : 'map-marker-outline'
                    } else if (route.name === 'Leaderboard') {
                        iconName = focused ? 'trophy' : 'trophy-outline'
                    } else if (route.name === 'Forum') {
                        iconName = focused
                            ? 'comment-multiple'
                            : 'comment-multiple-outline'
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'account' : 'account-outline'
                    } else {
                        iconName = 'unknown'
                    }

                    return (
                        <MaterialCommunityIcons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    )
                },
                tabBarActiveTintColor: '#519872', // main pastel green
                tabBarInactiveTintColor: '#3E8E6E', // darker pastel green
                headerStyle: {
                    backgroundColor: '#519872', // main pastel green header
                },
                headerTintColor: '#ffffff', // white text
            })}
        >
            <Tab.Screen name="Quest" component={HomeScreen} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Tab.Screen name="Forum" component={ForumScreen} />
            <Tab.Screen name="Profile" component={DashboardScreen} />
        </Tab.Navigator>
    )
}

export default function AppNavigator() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const theme = {
        ...DefaultTheme,
        myOwnProperty: true,
        colors: {
            ...DefaultTheme.colors,
            myOwnColor: '#BADA55',
        },
    }

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
                                    title: 'Assignment Details',
                                    headerStyle: {
                                        backgroundColor: '#519872',
                                    },
                                    headerTintColor: '#fff',
                                }}
                            />
                            <Stack.Screen
                                name="AssignmentFile"
                                component={AssignmentFileScreen}
                                options={{
                                    title: 'Assignment Details',
                                    headerStyle: {
                                        backgroundColor: '#519872',
                                    },
                                    headerTintColor: '#fff',
                                }}
                            />
                            <Stack.Screen
                                name="Dino Library"
                                component={StorybookScreen}
                                options={{
                                    headerShown: true,
                                    headerStyle: {
                                        backgroundColor: '#519872',
                                    },
                                    headerTintColor: '#fff',
                                    headerTitleStyle: {
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                            {/* 👇 Added this for your scrapbook button */}
                            <Stack.Screen
                                name="Scrapbook"
                                component={ProfileScreen}
                                options={{
                                    title: 'Scrapbook',
                                    headerStyle: {
                                        backgroundColor: '#519872',
                                    },
                                    headerTintColor: '#fff',
                                    headerTitleStyle: {
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Stack.Screen
                                name="Login"
                                options={{ headerShown: false }}
                            >
                                {() => (
                                    <LoginScreen
                                        setIsLoggedIn={setIsLoggedIn}
                                    />
                                )}
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
    )
}

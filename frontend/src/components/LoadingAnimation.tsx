import React from 'react'
import { View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";

interface Props {
    text: string;
}

const LoadingAnimation = ({ text } : Props) => {
  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>{text}</Text>
    </View>
  )
}

export default LoadingAnimation

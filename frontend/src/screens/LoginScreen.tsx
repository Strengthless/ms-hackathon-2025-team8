import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Title, Text, useTheme } from "react-native-paper";

type LoginScreenProps = {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  const { t } = useTranslation();

  const navigation = useNavigation();

  const handleLogin = () => {
    // Simple validation - in a real app, you'd verify against a backend
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    logo: {
      width: 100,
      height: 100,
      alignSelf: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 5,
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 30,
      color: theme.colors.secondary,
    },
    input: {
      marginBottom: 15,
    },
    button: {
      marginTop: 10,
      paddingVertical: 5,
      backgroundColor: theme.colors.primary,
    },
    buttonLabel: {
      fontSize: 16,
    },
    signupButton: {
      marginTop: 15,
    },
    signupButtonLabel: {
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://img.icons8.com/color/96/000000/children.png" }}
        style={styles.logo}
      />
      <Title style={styles.title}>{t("login.title")}</Title>
      <Text style={styles.subtitle}>{t("login.subtitle")}</Text>

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon icon="account" />}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon icon="lock" />}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Signup")}
        style={styles.signupButton}
        labelStyle={styles.signupButtonLabel}
      >
        Don't have an account? Sign up
      </Button>
    </View>
  );
};

export default LoginScreen;

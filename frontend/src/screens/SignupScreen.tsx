import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

const SignupScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleSignup = () => {
    if (username && password && password === confirmPassword) {
      navigation.navigate("Login");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/mascot_signup.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {t("signup.createAccount", "Create Account")}
          </Text>
          <Text style={styles.subtitle}>
            {t("signup.joinAdventure", "Join the adventure!")}
          </Text>
          <Text style={styles.tagline}>
            {t("signup.tagline", "Learn, Play, Grow!")}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label={t("signup.username", "Username")}
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" color="#519872" />}
            theme={{
              colors: {
                primary: "#519872",
                background: "#FFFFFF",
              },
              roundness: 16,
            }}
            outlineColor="rgba(81, 152, 114, 0.3)"
            activeOutlineColor="#519872"
          />

          <TextInput
            label={t("signup.password", "Password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" color="#519872" />}
            right={
              <TextInput.Icon
                icon={isPasswordVisible ? "eye-off" : "eye"}
                color="#519872"
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            }
            theme={{
              colors: {
                primary: "#519872",
                background: "#FFFFFF",
              },
              roundness: 16,
            }}
            outlineColor="rgba(81, 152, 114, 0.3)"
            activeOutlineColor="#519872"
          />

          <TextInput
            label={t("signup.confirmPassword", "Confirm Password")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock-check" color="#519872" />}
            right={
              <TextInput.Icon
                icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                color="#519872"
                onPress={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              />
            }
            theme={{
              colors: {
                primary: "#519872",
                background: "#FFFFFF",
              },
              roundness: 16,
            }}
            outlineColor="rgba(81, 152, 114, 0.3)"
            activeOutlineColor="#519872"
          />

          <Button
            mode="contained"
            onPress={handleSignup}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            {t("signup.signUpButton", "Sign Up")}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.loginButton}
            labelStyle={styles.loginButtonLabel}
          >
            {t("signup.alreadyHaveAccount", "Already have an account? Login")}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F0FDF4",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    shadowColor: "#519872",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: -70,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  formContainer: {
    marginHorizontal: 8,
    marginTop: -30,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    color: "#3E8E6E",
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 6,
    color: "#519872",
    fontWeight: "600",
  },
  tagline: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#519872",
    fontWeight: "500",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    shadowColor: "#7FC9A6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 28,
    backgroundColor: "#3E8E6E",
    shadowColor: "#7FC9A6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.5,
  },
  loginButton: {
    marginTop: 24,
  },
  loginButtonLabel: {
    color: "#519872",
    fontWeight: "600",
  },
});

export default SignupScreen;

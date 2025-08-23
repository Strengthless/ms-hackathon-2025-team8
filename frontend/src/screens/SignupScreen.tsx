import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // Simple validation
    if (username && password && password === confirmPassword) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.icons8.com/color/96/000000/children.png' }}
        style={styles.logo}
      />
      <Title style={styles.title}>Create Account</Title>
      <Text style={styles.subtitle}>Join the phonics adventure!</Text>

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

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon icon="lock-check" />}
      />

      <Button
        mode="contained"
        onPress={handleSignup}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Sign Up
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.loginButton}
        labelStyle={styles.loginButtonLabel}
      >
        Already have an account? Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#6200EE',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#757575',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    backgroundColor: '#6200EE',
  },
  buttonLabel: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: 15,
  },
  loginButtonLabel: {
    color: '#6200EE',
  },
});

export default SignupScreen;

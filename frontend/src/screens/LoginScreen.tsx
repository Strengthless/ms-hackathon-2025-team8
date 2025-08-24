import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper'
import { useTranslation } from 'react-i18next'

interface LoginScreenProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void
}

const LoginScreen = ({ setIsLoggedIn }: LoginScreenProps) => {
    const { t, i18n } = useTranslation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const navigation = useNavigation<any>()

    const handleLogin = () => {
        if (username && password) {
            setIsLoggedIn(true)
        }
    }

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'zh-HK' : 'en'
        i18n.changeLanguage(newLang)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/images/mascot.png')}
                            style={styles.logo}
                        />
                    </View>

                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{t('login.name')}</Text>
                        <Text style={styles.subtitle}>
                            {t('login.growTogether')}
                        </Text>
                        <Text style={styles.tagline}>{t('login.tagline')}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <TextInput
                            label={t('login.username')}
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            mode="outlined"
                            left={
                                <TextInput.Icon
                                    icon="account"
                                    color="#519872"
                                />
                            }
                            theme={{
                                colors: {
                                    primary: '#7FC9A6',
                                    background: '#FFFFFF',
                                },
                                roundness: 16,
                            }}
                            outlineColor="rgba(127,201,166,0.3)"
                            activeOutlineColor="#7FC9A6"
                        />

                        <TextInput
                            label={t('login.password')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                            style={styles.input}
                            mode="outlined"
                            left={
                                <TextInput.Icon icon="lock" color="#519872" />
                            }
                            right={
                                <TextInput.Icon
                                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                                    color="#519872"
                                    onPress={() =>
                                        setIsPasswordVisible(!isPasswordVisible)
                                    }
                                />
                            }
                            theme={{
                                colors: {
                                    primary: '#7FC9A6',
                                    background: '#FFFFFF',
                                },
                                roundness: 16,
                            }}
                            outlineColor="rgba(127,201,166,0.3)"
                            activeOutlineColor="#7FC9A6"
                        />

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                            contentStyle={styles.buttonContent}
                        >
                            {t('login.loginButton')}
                        </Button>

                        <Button
                            mode="text"
                            onPress={() => navigation.navigate('Signup')}
                            style={styles.signupButton}
                            labelStyle={styles.signupButtonLabel}
                        >
                            {t('login.signupPrompt')}
                        </Button>

                        {/* Language Toggle Button */}
                        <Button
                            mode="outlined"
                            onPress={toggleLanguage}
                            style={styles.langButton}
                            labelStyle={styles.langButtonLabel}
                        >
                            {i18n.language === 'en' ? '中文 (繁體)' : 'English'}
                        </Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F7F4',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        shadowColor: '#7FC9A6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    formContainer: {
        marginHorizontal: 8,
        marginTop: -40,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
        marginTop: -90,
        color: '#3E8E6E',
        letterSpacing: 0.8,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 12,
        color: '#519872',
        fontWeight: '600',
    },
    tagline: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
        color: '#519872',
        fontWeight: '500',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        shadowColor: '#7FC9A6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
        borderRadius: 28,
        backgroundColor: '#3E8E6E',
        shadowColor: '#7FC9A6',
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
        fontWeight: '700',
        color: 'white',
        letterSpacing: 0.5,
    },
    signupButton: {
        marginTop: 24,
    },
    signupButtonLabel: {
        color: '#519872',
        fontWeight: '600',
    },
    langButton: {
        marginTop: 16,
        borderColor: '#519872',
        borderWidth: 1,
        borderRadius: 24,
    },
    langButtonLabel: {
        color: '#3E8E6E',
        fontWeight: '600',
    },
})

export default LoginScreen

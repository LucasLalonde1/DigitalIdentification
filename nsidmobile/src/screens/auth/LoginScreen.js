import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ActivityIndicator, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // On startup, check support for features needed
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  /**
   * When user clicks login
   */
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Calling api.js to login
      await login(email, password);
      // Need these two variables for saving last login attempt info for faceID
      await AsyncStorage.setItem('loginEmail', email);
      await AsyncStorage.setItem('loginPassword', password);
      // If login was successful continue
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error details:', error);
      Alert.alert('Login failed', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * When user clicks login with faceID, use async storage last login attempt
   * credentials if they exist.
   * @returns Errors if something goes wrong
   */
  const handleBiometricLogin = async () => {
    const biometricRecords = await LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) {
      return Alert.alert('Biometrics not available', 'Please set up FaceID or TouchID on your device.');
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login With FaceID',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });

    if (result.success) {
      // Collect the variables needed to login
      const savedEmail = await AsyncStorage.getItem('loginEmail');
      const savedPassword = await AsyncStorage.getItem('loginPassword');

      if (savedEmail && savedPassword) {
        setIsLoading(true);
        try {
          await login(savedEmail, savedPassword);
          navigation.navigate('Home');
        } catch (error) {
          console.error('Login failed:', error);
          Alert.alert('Login failed', 'Could not log in with the saved credentials. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        Alert.alert('No credentials saved', 'Please log in manually to save credentials for future biometric login.');
      }
    } else {
      Alert.alert('Authentication failed', result.error ? result.error : 'Failed to authenticate');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="black" />;
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          {isBiometricSupported && (
            <>
              <Text style={styles.biometricText}>OR</Text>
              <TouchableOpacity style={styles.button} onPress={handleBiometricLogin}>
                <Text style={styles.buttonText}>Login with FaceID/Passcode</Text>
              </TouchableOpacity>
            </>
          )}
          <Text style={styles.registerText}>
            First time signing in?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerButton}> Register</Text>
            </TouchableOpacity>
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Landing')}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  innerContainer: { // Added an inner container to keep the form elements centered
    width: '100%', // Ensures the input and buttons take full width
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#668cff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 100)',
    textShadowOffset: { width: 0.2, height: 0.2 },
    textShadowRadius: 1,
    alignSelf: 'left',
  },
  input: {
    width: '100%', // Ensures inputs are full width
    borderWidth: 1,
    borderColor: '#1979ff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f3f3f1',
  },
  button: {
    width: '100%', // Ensure buttons are full width
    backgroundColor: '#3d6adb',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricText: {
    textAlign: 'center',
    color: 'black',
  },
  registerText: {
    textAlign: 'center',
    color: 'black',
    marginVertical: 10,
  },
  registerButton: {
    color: '#ffeb00',
    fontWeight: 'bold',
  },
  backButton: {
    marginVertical: 10,
    padding: 10,
  },
  backButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default LoginScreen;

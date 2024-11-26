import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ActivityIndicator, StyleSheet } from 'react-native';
import { registerUser } from '../../api/Api'; // Import your registration method from Api.js

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // Calling api.js to register the user
      const response = await registerUser(email, password, firstName, lastName); // Use the register method
  
      if (response.status === 201) {
        Alert.alert('Registration Successful', 'You can now log in');
        navigation.navigate('Login'); // Navigate back to login screen after successful registration
      } else {
        Alert.alert('Registration failed', response.data.detail || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error);
      Alert.alert('Registration failed', 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#007bff" />;
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
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
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.registerText}>
            Already have an account?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.registerButton}>Login</Text>
            </TouchableOpacity>
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Landing')}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return <>{renderContent()}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#668cff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffeb00',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 100)',
    textShadowOffset: {width: 0.2, height: 0.2},
    textShadowRadius: 5
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#1979ff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f3f3f1',
  },
  button: {
    width: '100%', // Make button width same as input
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
  registerText: {
    textAlign: 'center',
    color: '#fff',
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
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import landingImage from '../../assets/images/landingbackground.png';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={landingImage} style={styles.background}>
        <View style={styles.titleContainer}>
          <Text style={styles.blueTitle}>YourIdentity<Text style={styles.yellowTitle}>NS</Text></Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.loginButton]} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.registerButton]} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.copyright}>© 2024 Company</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the background
    justifyContent: 'space-between', // Align content appropriately
    padding: 20,
  },
  titleContainer: {
    position: 'absolute', // Position text container absolutely
    top: 75, // Distance from top
    right: 20, // Distance from right side
    alignItems: 'flex-end', // Align text to the right
  },
  yellowTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffeb00', 
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0.2, height: 0.2 },
    textShadowRadius: 2,
  },
  blueTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3d6adb',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0.2, height: 0.2 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    flex: 1, // Allow button container to take up space
    justifyContent: 'flex-end', // Align buttons at the bottom
    width: '100%', // Full width for button container
    alignItems: 'center', // Center buttons
    marginBottom: 20, // Margin from bottom
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#3d6adb',
  },
  registerButton: {
    backgroundColor: '#fff242',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  copyright: {
    fontSize: 10,
    alignSelf: 'center',
    color: '#fff',
    position: 'absolute',
    bottom: 10, // Position the copyright text near the bottom
  },
});

export default LandingScreen;

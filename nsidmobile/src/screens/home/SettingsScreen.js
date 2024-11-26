import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { LinearGradient } from 'expo-linear-gradient'; // For gradient effect
import { AuthContext } from '../auth/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  const navigateToPrivacyStatement = () => navigation.navigate('PrivacyStatement');
  const navigateToAccountScreen = () => navigation.navigate('AccountScreen');
  const navigateToTermsScreen = () => navigation.navigate('TermsScreen'); // New navigation function
  const navigateToAboutScreen = () => navigation.navigate('AboutScreen'); // New navigation function

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0545b7', '#1f6ff9']} style={styles.banner} start={{ x: 0.3, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={styles.bannerText}>Settings</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.wrapper}>
          <Text style={styles.wrapperText}>
            <Image style={styles.wrapperImage} source={require('../../assets/images/settingsProfile.png')} />
            Account
          </Text>
          <View style={styles.underline} />

          <TouchableOpacity style={styles.settingItem} onPress={navigateToAccountScreen}>
            <Text style={styles.settingText}>
              <Image style={styles.settingImage} source={require('../../assets/images/editProfile.png')} />
              Edit Account
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.wrapper}>
          <Text style={styles.wrapperText}>
            <Image style={styles.wrapperImage} source={require('../../assets/images/privacy.png')} />
            Privacy
          </Text>
          <View style={styles.underline} />

          <TouchableOpacity style={styles.settingItem} onPress={navigateToPrivacyStatement}>
            <Text style={styles.settingText}>
              <Image style={styles.settingImage} source={require('../../assets/images/settingsShield.png')} />
              Privacy & Data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={navigateToTermsScreen}>
            <Image style={styles.settingImage} source={require('../../assets/images/termsImage.png')} />
            <Text style={styles.settingText}>Terms of Use</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.wrapper}>
          <Text style={styles.wrapperText}>
            <Image style={styles.wrapperImage} source={require('../../assets/images/otherImage.png')} />
            Other
          </Text>
          <View style={styles.underline} /> 

          <TouchableOpacity style={styles.settingItem} onPress={navigateToAboutScreen}>
            <Image style={styles.settingImage} source={require('../../assets/images/aboutImage.png')} />
            <Text style={styles.settingText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => { logout(); navigation.navigate('LandingScreen'); }}>
            <Ionicons name="log-out-outline" size={24} color="#333" style={styles.icon} />
            <Text style={styles.settingText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LinearGradient colors={['#0545b7', '#1f6ff9']} style={styles.footer} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  banner: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 50,
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
  },
  wrapper: {
    marginBottom: 15,
  },
  wrapperText: {
    fontSize: 25,
    paddingBottom: 10,
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  wrapperImage: {
    width: 30,
    height: 30,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)', // Mild black line
    marginBottom: 10,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  settingItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
  },
  settingImage: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  settingText: {
    fontSize: 18,
    fontWeight: '600', // Slightly bolder font weight
    color: '#333',
  },
  icon: {
    marginRight: 10, 
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  navButton: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingsScreen;

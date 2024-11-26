import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../auth/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import logoImage from '../../assets/images/logo.png';
import driverLicenseImage from '../../assets/images/driverLicenseImage.png';
import healthImage from '../../assets/images/healthImage.png';
import transitPassImage from '../../assets/images/transitPassImage.png';

const placeholderImages = {
  driver: driverLicenseImage,
  transit: transitPassImage, // Placeholder image for transit
  health: healthImage, // Placeholder image for health
  profile: 'https://via.placeholder.com/100',
  logo: logoImage,
};

const HomeScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState({ name: '', image: placeholderImages.profile });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const navigateToDriversLicense = () => navigation.navigate('EditDriversLicense');
  const navigateToTransit = () => navigation.navigate('EditTransit');
  const navigateToHealthCard = () => navigation.navigate('EditHealthCard');

  /**
   * On startup we collect stored user data that is used for
   * display on the homepage, first name, last name, and images 
   * specific to the user
   */
  const getUserData = async () => {
    setIsLoading(true);
    try {
      const firstName = await AsyncStorage.getItem('firstName');
      const lastName = await AsyncStorage.getItem('lastName');
      const profileImage = await AsyncStorage.getItem('profileImage');
      setUser({
        firstName: firstName || '?',
        lastName: lastName || '?',
        image: profileImage || placeholderImages.profile,
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#668cff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0545b7', '#1f6ff9']} style={styles.banner} start={{ x: 0.3, y: 0 }} end={{x: 1,y: 1}}>
      <View style={styles.bannerContent}>
          <Image source={placeholderImages.logo} style={styles.bannerImage} />
          <Text style={styles.bannerText}>YourIdentityNS</Text>
        </View>
        <TouchableOpacity onPress={() => { logout(); navigation.navigate('LandingScreen'); }}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.profileSection}>
        <Text style={styles.greetingText}>
          <Text style={styles.profileName}>Hello, {user.firstName}</Text>
        </Text>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.titleText}>My Cards</Text>
        <View style={styles.lineStyle} />
      </View>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        
      <View style={styles.wrapper}>
        <Text style={styles.wrapperText}>Drivers License</Text>
        <View style={styles.underline} />
        <TouchableOpacity style={styles.card} onPress={navigateToDriversLicense}>
          <Image source={placeholderImages.driver} style={styles.cardImage} />
          <Text style={styles.cardText}>Driver's License</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.wrapper}>
        <Text style={styles.wrapperText}>Transit Pass</Text>
        <View style={styles.underline} />
        <TouchableOpacity style={styles.card} onPress={navigateToTransit}>
          <Image source={placeholderImages.transit} style={styles.cardImage} />
          <Text style={styles.cardText}>Transit Pass</Text>
        </TouchableOpacity>
        </View>

      <View style={styles.wrapper}>
        <Text style={styles.wrapperText}>Health Card</Text>
        <View style={styles.underline} />
        <TouchableOpacity style={styles.card} onPress={navigateToHealthCard}>
          <Image source={placeholderImages.health} style={styles.cardImage} />
          <Text style={styles.cardText}>Health Card</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeee4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    borderBottomRightRadius: 50,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 10,
  },
  bannerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  profileSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  greetingText: {
    paddingLeft: 20,
  },
  profileName: {
    fontSize: 25,
    fontWeight: '500',
    color: '#333',
  },
  titleSection: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  wrapper: {
    marginBottom: 15,
    width: "100%",
  },
  wrapperText: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    marginBottom: 10,
  },
  cardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    width: '100%',
    height: 180,
    backgroundColor: '#A8E6CF',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    elevation: 4,
    overflow: 'hidden', // Ensures the image fits within the card container
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Makes the image cover the full area of the card
  },
  cardText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Makes text stand out against the background
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
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    marginRight: 20,
    marginTop: 20,
  },
});

export default HomeScreen;

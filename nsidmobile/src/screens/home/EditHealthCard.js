import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHealthCard, addHealthCard } from '../../api/Api';

const EditHealthCard = ({ navigation }) => {
  const [healthCardNumber, setHealthCardNumber] = useState('');
  const [healthCardData, setHealthCardData] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * On load Collect stored email from storage for sending post request
   */
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail) {
          setEmail(storedEmail);
        }

        // Fetch the latest health card data from the server if email exists
        await fetchHealthCardData(storedEmail);
      } catch (error) {
        Alert.alert('Error', 'An error occurred during initialization');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * Make post request to collect all relevant health card
   * data from our database. This collect up to date data from
   * the database each time
   * @param {*} HealthCardNumberOrEmail either or works, we use email
   */
  const fetchHealthCardData = async (HealthCardNumberOrEmail) => {
    setIsLoading(true);
    try {
      // api.js post request to get data
      const response = await getHealthCard(HealthCardNumberOrEmail);
      if (response) {
        // Save the data
        const healthCard = response[0] || response;
        setHealthCardData(healthCard);
        setHealthCardNumber(healthCard.healthCardNumber || '');
        await AsyncStorage.setItem('healthCard', JSON.stringify(healthCard));
      } else {
        Alert.alert('Error', 'No health card found.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching health card data');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * First time user signs up, we need to allow them to enter 
   * their health card number to verify and associate their health card
   * with their account. Called when user inputs health card number
   * for the first time.
   * @returns 
   */
  const handleSaveHealthCard = async () => {
    if (!healthCardNumber) {
      Alert.alert('Error', 'Please enter a health card number');
      return;
    }

    setIsLoading(true);
    try {
      // Api.js post request to verify license
      await addHealthCard({ healthCardNumber });
      const newHealthCard = { healthCardNumber };
      setHealthCardData(newHealthCard);

      // Save the license number in storatge
      await AsyncStorage.setItem('healthCard', JSON.stringify(newHealthCard));
      Alert.alert('Success', 'Health Card saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the health card');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#668cff" />;
    }

    return healthCardData ? (
      <View style={styles.main}>
        <Image 
          source={{ uri: 'https://thumbs.dreamstime.com/b/health-insurance-card-flat-design-white-background-medical-concept-vector-illustration-200308455.jpg' }}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>Health Card</Text>
        <Text style={styles.cardNumber}>{healthCardData.card_number}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Expiration Date: {healthCardData.expiration_date}</Text>
          <Text style={styles.label}>Province: {healthCardData.province}</Text>
        </View>
      </View>
    ) : (
      <View>
        <Text style={styles.title}>Add Your Health Card</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Health Card Number"
          value={healthCardNumber}
          onChangeText={setHealthCardNumber}
          keyboardType="default"
        />
        <Button title="Save Health Card" onPress={handleSaveHealthCard} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../assets/images/back_arrow.png')} style={styles.backIcon} />
      </TouchableOpacity>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    position: 'absolute', // Position it at the top left
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 1, // Bring it above other elements if necessary
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  main: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardImage: {
    width: "70%",
    height: "30%", 
    marginBottom: 20,
    borderRadius: 30,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  cardSubtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#6c757d',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#495057',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ced4da',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    color: '#495057',
    fontSize: 16,
  },
});

export default EditHealthCard;

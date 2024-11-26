import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addTransit, getTransit } from '../../api/Api'; // Adjust the import path if necessary

const EditTransit = ({ navigation }) => {
  const [transitNumber, setTransitNumber] = useState('');
  const [transitData, setTransitData] = useState(null);
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

        // Fetch the latest transit pass data from the server if email exists
        await fetchTransitData(storedEmail);
        
      } catch (error) {
        Alert.alert("Error", "Error in initialize");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * Make post request to collect all relevant transit pass
   * data from our database. This collect up to date data from
   * the database each time
   * @param {*} transitNumberOrEmail 
   */
  const fetchTransitData = async (transitNumberOrEmail) => {
    setIsLoading(true);
    try {
      // api.js post request to get data
      const response = await getTransit(transitNumberOrEmail);
      if (response) {
        // Save the data
        const transit = response[0] || response;
        setTransitData(transit);
        setTransitNumber(transit.transitNumber || '');
        await AsyncStorage.setItem('transit', JSON.stringify(transit));
      } else {
        Alert.alert('Error', 'No transit pass found.');
      }
    } catch (error) {
      Alert.alert("Error", "Error in fetchTransitData");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * First time user signs up, we need to allow them to enter 
   * their transit pass number to verify and associate their transit pass
   * with their account. Called when user inputs transit pass number
   * for the first time.
   * @returns 
   */
  const handleSaveTransit = async () => {
    if (!transitNumber) {
      Alert.alert('Error', 'Please enter a Transit pass number');
      return;
    }

    setIsLoading(true);
    try {
      // Api.js post request to verify license
      await addTransit({ transitNumber });
      const newPass = { transitNumber };
      setTransitData(newPass);

      // Save the license number in storatge
      await AsyncStorage.setItem('transit', JSON.stringify(newPass));
      Alert.alert('Success', 'Transit Pass saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Error in handleSaveTransit");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#668cff" />;
    }

    return transitData ? (
      <View style={styles.main}>
        <Image 
          source={{ uri: 'https://png.pngtree.com/png-clipart/20230814/original/pngtree-bus-ticket-icon-color-flat-picture-image_7942523.png' }}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>Transit Pass</Text>
        <Text style={styles.cardSubtitle}>{transitData.card_number}</Text>
        <Text style={styles.label}>Balance: {transitData.balance}</Text>
        <Text style={styles.label}>Expiration: {transitData.expiration_date}</Text>
      </View>
    ) : (
      <View>
        <Text style={styles.title}>Add Your Transit Pass</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Transit Pass Number"
          value={transitNumber}
          onChangeText={setTransitNumber}
          keyboardType="default"
        />
        <Button title="Save Transit Pass" onPress={handleSaveTransit} />
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

export default EditTransit;

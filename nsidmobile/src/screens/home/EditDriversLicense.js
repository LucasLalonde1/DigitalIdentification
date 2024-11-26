import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDriversLicense, addDriversLicense } from '../../api/Api';

const EditDriversLicense = ({ navigation }) => {
  const [driversLicenseNumber, setDriversLicenseNumber] = useState('');
  const [driversLicense, setDriversLicense] = useState(null);
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

        // Fetch the latest drivers license data from the server if email exists
        await fetchLicenseData(storedEmail);
      } catch (error) {
        Alert.alert("Error", "Error in initializing");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * Make post request to collect all relevant driver license
   * data from our database. This collect up to date data from
   * the database each time
   * @param {*} licenseNumberOrEmail either or works, we use email
   */
  const fetchLicenseData = async (licenseNumberOrEmail) => {
    setIsLoading(true);
    try {
      // api.js post request to get data
      const response = await getDriversLicense(licenseNumberOrEmail);
      if (response) {
        // Save the data
        const license = response[0] || response;
        setDriversLicense(license);
        setDriversLicenseNumber(license.driversLicenseNumber || license.license_number || '');
        await AsyncStorage.setItem('driversLicense', JSON.stringify(license));
      } else {
        Alert.alert('Error', 'No license found.');
      }
    } catch (error) {
      handleError(error, 'fetchLicenseData');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * First time user signs up, we need to allow them to enter 
   * their license number to verify and associate their license
   * with their account. Called when user inputs license number
   * for the first time.
   * @returns errors in adding license
   */
  const handleSaveLicense = async () => {
    if (!driversLicenseNumber) {
      Alert.alert('Error', 'Please enter a license number');
      return;
    }

    setIsLoading(true);
    try {
      // Api.js post request to verify license
      await addDriversLicense({ driversLicenseNumber });
      const newLicense = { driversLicenseNumber };
      setDriversLicense(newLicense);

      // Save the license number in storage
      await AsyncStorage.setItem('driversLicense', JSON.stringify(newLicense));
      Alert.alert('Success', 'Driver’s License saved successfully');

      navigation.goBack();

    } catch (error) {
      Alert.alert('Error', 'HandleSaveLicenseError');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#668cff" />;
    }

    return driversLicense ? (
      <View style={styles.main}>
        <Image 
          source={{ uri: 'https://thumbs.dreamstime.com/b/man-driver-license-plastic-card-template-id-card-vector-stock-illustration-man-driver-license-plastic-card-template-id-card-vector-168398690.jpg' }}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>Driver's License</Text>
        <Text style={styles.cardSubtitle}>{driversLicense.license_number}</Text>
        <Text style={styles.label}>Issued Province: {driversLicense.province}</Text>
        <Text style={styles.label}>Expiration Date: {driversLicense.expiration_date}</Text>
      </View>
    ) : (
      <View>
        <Text style={styles.title}>Add Your Driver's License</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter License Number"
          value={driversLicenseNumber}
          onChangeText={setDriversLicenseNumber}
          keyboardType="default"
        />
        <Button title="Save License" onPress={handleSaveLicense} />
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
    width: "100%",
    height: "40%", 
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
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

export default EditDriversLicense;

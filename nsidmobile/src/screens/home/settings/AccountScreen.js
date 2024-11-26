import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../../../api/Api'; // Adjust the path as necessary

const AccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEditing, setIsEditing] = useState({ field: null, value: '' });
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New loading state

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const response = await getUserData();
        console.log(response.user);
        setUser(response.user); // Assuming your API returns user data in the "user" field
        setEmail(response.user.email); // Set email from user data
        setFirstName(response.user.first_name); // Set name from user data
        setLastName(response.user.last_name);
      } catch (error) {
        console.error('Failed to load user data:', error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = (field, value) => {
    setIsEditing({ field, value });
  };

  const handleSaveChanges = async () => {
    try {
      Alert.alert('Failed', 'Havent implemented the setter yet');
      setIsEditing({ field: null, value: '' });
    } catch (error) {
      Alert.alert("Error", "Failed to save account data.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../../assets/images/back_arrow.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Account Information</Text>

        {isLoading ? ( // Check if loading
          <ActivityIndicator size="large" color="#668cff" />
        ) : (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              {isEditing.field === 'email' ? (
                <TextInput
                  style={styles.input}
                  value={isEditing.value}
                  onChangeText={(text) => setIsEditing({ ...isEditing, value: text })}
                  keyboardType="email-address"
                />
              ) : (
                <View style={styles.infoContainer}>
                  <Text style={styles.text}>{email}</Text>
                  <TouchableOpacity onPress={() => handleEdit('email', email)}>
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>First Name</Text>
              {isEditing.field === 'firstName' ? (
                <TextInput
                  style={styles.input}
                  value={isEditing.value}
                  onChangeText={(text) => setIsEditing({ ...isEditing, value: text })}
                />
              ) : (
                <View style={styles.infoContainer}>
                  <Text style={styles.text}>{firstName}</Text>
                  <TouchableOpacity onPress={() => handleEdit('firstName', firstName)}>
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Last Name</Text>
              {isEditing.field === 'lastName' ? (
                <TextInput
                  style={styles.input}
                  value={isEditing.value}
                  onChangeText={(text) => setIsEditing({ ...isEditing, value: text })}
                />
              ) : (
                <View style={styles.infoContainer}>
                  <Text style={styles.text}>{lastName}</Text>
                  <TouchableOpacity onPress={() => handleEdit('lastName', lastName)}>
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {isEditing.field && (
              <Button
                title="Save Changes"
                onPress={handleSaveChanges}
                color="#668cff"
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 75,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#444',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '75%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  text: {
    width: '75%',
    alignSelf: 'center',
    fontSize: 16,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#ced4da',
    borderWidth: 1,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    color: '#007BFF',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AccountScreen;

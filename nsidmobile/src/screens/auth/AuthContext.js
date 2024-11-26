import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, refreshAccessToken as refreshAccessTokenAPI } from '../../api/Api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const login = async (email, password) => {
    try {
      const { access, refresh, firstName, lastName } = await loginUser(email, password);

      // Store the tokens and user info in AsyncStorage
      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);
      await AsyncStorage.setItem('firstName', firstName); 
      await AsyncStorage.setItem('lastName', lastName);  
      await AsyncStorage.setItem('email', email);

      setFirstName(firstName);
      setLastName(lastName);

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; 
    }
  };

  const logout = async () => {
    // Clear authentication status and AsyncStorage items
    setIsAuthenticated(false);
    setFirstName('');
    setLastName('');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('firstName');
    await AsyncStorage.removeItem('lastName');
    await AsyncStorage.removeItem('email');
  };

  /**
   * Collects refresh token and asks api.js to get a new access token
   * @returns access token
   */
  const refreshAccessToken = async () => {
    try {
      const refresh = await AsyncStorage.getItem('refreshToken');
      if (!refresh) throw new Error("No refresh token found");
  
      const newAccessToken = await refreshAccessTokenAPI(refresh);
      if (newAccessToken) {
        await AsyncStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      } else {
        throw new Error("Failed to refresh access token");
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  };
  
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, firstName, lastName, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

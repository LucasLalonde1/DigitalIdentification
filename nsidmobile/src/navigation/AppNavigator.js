import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { AuthContext } from '../screens/auth/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SettingsScreen from '../screens/home/SettingsScreen';
import EditDriversLicense from '../screens/home/EditDriversLicense';
import EditHealthCard from '../screens/home/EditHealthCard';
import EditTransit from '../screens/home/EditTransit';
import LandingScreen from '../screens/auth/LandingScreen';
import PrivacyStatement from '../screens/home/settings/PrivacyStatement';
import AccountScreen from '../screens/home/settings/AccountScreen';
import AboutScreen from '../screens/home/settings/AboutScreen';
import TermsScreen from '../screens/home/settings/TermsScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{}}>
      {isAuthenticated ? ( // Authenticated permission required for these (after login)
        <>
          <Stack.Screen options={{ headerShown: false, animationEnabled: false}} name="LandingScreen" component={LandingScreen} />
          <Stack.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
          <Stack.Screen options={{ headerShown: false, animationEnabled: false }} name="Home" component={HomeScreen} />
          <Stack.Screen options={{ headerShown: false, animationEnabled: false }} name="Settings" component={SettingsScreen} />
          <Stack.Screen options={{ headerShown: false }} name="AccountScreen" component={AccountScreen} />
          <Stack.Screen options={{ headerShown: false }} name="EditDriversLicense" component={EditDriversLicense} />
          <Stack.Screen options={{ headerShown: false }} name="EditHealthCard" component={EditHealthCard} />
          <Stack.Screen options={{ headerShown: false }} name="EditTransit" component={EditTransit} />
          <Stack.Screen options={{ headerShown: false }} name="PrivacyStatement" component={PrivacyStatement} />
          <Stack.Screen options={{ headerShown: false }} name="TermsScreen" component={TermsScreen} />
          <Stack.Screen options={{ headerShown: false }} name="AboutScreen" component={AboutScreen} />
        </>
      ) : ( 
        <>
          <Stack.Screen options={{ headerShown: false, animationEnabled: false }} name="LandingScreen" component={LandingScreen} />
          <Stack.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';

const PrivacyStatement = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../../assets/images/back_arrow.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.header}>Privacy Statement</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.content}>
          Your privacy is important to us. This privacy statement explains how we collect, use, and share your information...
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 75,
    backgroundColor: '#ffffff',
  },
  backButton: {
    marginBottom: 20,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default PrivacyStatement;

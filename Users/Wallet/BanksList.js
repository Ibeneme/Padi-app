import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';

const BanksList = () => {
  const [banks, setBanks] = useState([]); // State to store the list of banks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch the list of banks
  const fetchBanks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/paystack/banks');
      console.log(response?.data, 'response?.data?response?.data?') // Update with your backend URL
      if (response?.data?.status) {
        setBanks(response.data.data); // Set the bank data
      } else {
        setError('Failed to fetch banks.');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching bank data.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchBanks(); // Fetch the bank data on component mount
  }, []);

  // Render a single bank item
  const renderBankItem = ({ item }) => (
    <View style={styles.bankItem}>
      <Text style={styles.bankName}>{item.name}</Text>
      <Text style={styles.bankCode}>Code: {item.code}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#515FDF" />
        <Text style={styles.loadingText}>Loading banks...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    Alert.alert('Error', error); // Display an alert if there's an error
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Banks List</Text>
      {banks.length > 0 ? (
        <FlatList
          data={banks}
          keyExtractor={(item, index) => index.toString()} // Use index as key if no unique ID is present
          renderItem={renderBankItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyText}>No banks available.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 16,
  },
  bankItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bankCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default BanksList;
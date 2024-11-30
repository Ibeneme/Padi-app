import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';

const EarningsDetail = () => {
  const route = useRoute();

  // Extracting rideId, type, and earningsData from the route params
  const {rideId, type} = route.params;

  useEffect(() => {
    // Logging the received parameters
    console.log('Ride ID:', rideId);
    console.log('Type:', type);
  }, [rideId, type]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Earnings Detail</Text>
      <Text style={styles.detail}>Ride ID: {rideId}</Text>
      <Text style={styles.detail}>Type: {type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detail: {
    fontSize: 18,
    marginVertical: 6,
    color: '#666',
  },
});

export default EarningsDetail;

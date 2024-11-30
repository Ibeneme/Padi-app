import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {loginUser} from '../../Redux/Auth/Auth';
import {useDispatch} from 'react-redux';
import * as SecureStore from 'react-native-secure-store';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

export default function Auth() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const [phone_number, password] = await Promise.all([
            RNSecureStorage.getItem('phone_number'),
            RNSecureStorage.getItem('password'),
          ]);

          if (phone_number && password) {
            console.log('Stored phone_number:', phone_number);
            console.log('Stored password:', password);

            const loginData = {
              phone_number,
              password,
            };

            setLoading(true); // Assuming setLoading is defined and handles loading state

            dispatch(loginUser(loginData))
              .then(response => {
                setLoading(false);
                console.log('Login successful:', response);
                // Example logic based on response status or token
                if (response?.payload?.message === 'Login successful') {
                  navigation.navigate('Home'); // Navigate to appropriate screen on successful login
                }
              })
              .catch(error => {
                setLoading(false);
                console.error('Login failed:', error);
                // Handle login error
              });
          } else {
            console.log('phone_number or password not found in storage');
          }
        } catch (error) {
          console.error('Error retrieving phone_number and password:', error);
        }
      };

      fetchData();
    }, [dispatch, navigation]),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const phone_number = await SecureStore.getItem('phone_number');
        const password = await SecureStore.getItem('password');

        console.log('Stored phone_number:', phone_number);
        console.log('Stored password:', password);

        if (phone_number && password) {
          const loginData = {
            phone_number,
            password,
          };

          dispatch(loginUser(loginData))
            .then(response => {
              setLoading(false);
              console.log('Login successful:', response);
              // Example logic based on response status or token
              if (response?.payload?.message === 'Login successful') {
                navigation.navigate('Home'); // Navigate to appropriate screen on successful login
              }
            })
            .catch(error => {
              setLoading(false);
              console.error('Login failed:', error);
              // Handle login error
            });
        } else {
          setLoading(false);
          console.log('No stored credentials found.');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error retrieving phone_number and password:', error);
      }
    };

    fetchData();

    // Clean up function if needed
    return () => {
      // Cleanup logic here
    };
  }, [dispatch, navigation]);

  return (
    <View
      style={[
        styles.containerfirst,
        {
          backgroundColor: '#ffff',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <View style={styles.container}>
        <Text style={styles.text}>Padiman Route....</Text>
        <Text style={[styles.textsmall]}>Travel and Parcel Smart</Text>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          style={styles.buttonClick}>
          <Text style={styles.buttonText}>Existing User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('createAccount')}
          style={styles.buttonClicks}>
          <Text style={styles.buttonText}>New User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerfirst: {
    height: '100%',
    padding: 16,
  },
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 94,
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Plus Jakarta Sans Bold',
    marginTop: '5%',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  textsmall: {
    color: '#666666',
    textAlign: 'center',
    fontSize: 13,
    marginTop: '0.5%',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  containerButton: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
  },
  buttonClick: {
    backgroundColor: '#515FDF',
    width: '100%',
    height: 55,
    borderRadius: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonClicks: {
    backgroundColor: '#18CC3F',
    width: '100%',
    height: 55,
    borderRadius: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Plus Jakarta Sans SemiBold',
    fontSize: 14,
  },
});

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserById, updateUserDetails} from '../../Redux/Auth/Auth';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {fetchAllPosts} from '../../Redux/Posts/Post';
//import {fetchUserById, fetchAllPosts} from '../../Redux/Actions'; // Adjust according to your actions
//import ArrowLeftSVG from '../components/ArrowLeftSVG'; // Adjust path for the ArrowLeftSVG component

const UpdateProfile = ({navigation}) => {
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Fetch user data from AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          const storedAccessToken = await AsyncStorage.getItem('access_token');
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
          console.log('Stored User ID:', storedUserId);
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };
      getUserData();
    }, []),
  );

  // Fetch user profile and posts on focus
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        setLoading(true); // Show loading indicator while fetching data
        Promise.all([
          dispatch(fetchUserById(userId)), // Fetch user profile by ID
          dispatch(fetchAllPosts()), // Fetch posts
        ])
          .then(([userProfileResponse, postsResponse]) => {
            setUserProfile(userProfileResponse?.payload); // Set user profile
            console.log('Fetched user profile:', userProfileResponse?.payload);
            console.log('Fetched posts:', postsResponse?.payload);
          })
          .catch(error => {
            console.log('Error fetching data:', error);
            setError('Failed to fetch data.');
          })
          .finally(() => {
            setLoading(false); // Hide loading indicator after fetching
          });
      }
    }, [dispatch, userId, accessToken]), // Depend on userId and accessToken to trigger the fetch
  );
  const handleProfileUpdate = () => {
    setLoading(true); // Show loading indicator while the request is in progress
    dispatch(
      updateUserDetails({
        first_name: firstName ? firstName : userProfile?.first_name,
        last_name: lastName ? lastName : userProfile?.last_name,
        phone_number: phoneNumber ? phoneNumber : userProfile?.phone_number,
        email: email ? email : userProfile?.email,
        id: userId,
      }),
    )
      .unwrap()
      .then(data => {
        console.log('Profile updated successfully', data);
        if (data?.success === true) {
          alert('Profile updated successfully!');
          navigation.goBack();
          // You can reset form fields or navigate to another screen here
        }
      })
      .catch(error => {
        console.error('Failed to update profile:', error);
        setError('An error occurred while updating your profile.');
      })
      .finally(() => {
        setLoading(false); // Hide loading indicator after the request is completed
      });
  };

  const handleFirstNameChange = text => {
    setFirstName(text);
    if (!text) setFirstNameError('First name is required');
    else setFirstNameError('');
  };

  const handleLastNameChange = text => {
    setLastName(text);
    if (!text) setLastNameError('Last name is required');
    else setLastNameError('');
  };

  const handlePhoneNumberChange = text => {
    setPhoneNumber(text);
    if (!text) setPhoneNumberError('Phone number is required');
    else setPhoneNumberError('');
  };

  const handleEmailChange = text => {
    setEmail(text);
    if (!text) setEmailError('Email is required');
    else setEmailError('');
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView style={{flexGrow: 1}}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>

          <Text style={styles.title}>Update your profile</Text>

          {error ? (
            <Text style={[styles.errorText, {backgroundColor: '#ff000025'}]}>
              {error}
            </Text>
          ) : null}

          {email && (
            <Text
              style={[
                styles.errorText,
                {backgroundColor: '#515FDF25', color: '#515FDF'},
              ]}>
              {email}
            </Text>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[
                styles.input,
                firstNameError && {borderColor: 'red'},
                focusedInput === 'firstName' && {borderColor: '#515FDF'},
              ]}
              onFocus={() => setFocusedInput('firstName')}
              onBlur={() => setFocusedInput(null)}
              value={firstName}
              onChangeText={handleFirstNameChange}
              placeholder={userProfile?.first_name || 'Enter your first name'}
              placeholderTextColor="#00000060"
            />
            {firstNameError && (
              <Text style={styles.errorText}>{firstNameError}</Text>
            )}

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[
                styles.input,
                lastNameError && {borderColor: 'red'},
                focusedInput === 'lastName' && {borderColor: '#515FDF'},
              ]}
              onFocus={() => setFocusedInput('lastName')}
              onBlur={() => setFocusedInput(null)}
              value={lastName}
              onChangeText={handleLastNameChange}
              placeholder={userProfile?.last_name || 'Enter your last name'}
              placeholderTextColor="#00000060"
            />
            {lastNameError && (
              <Text style={styles.errorText}>{lastNameError}</Text>
            )}

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                phoneNumberError && {borderColor: 'red'},
                focusedInput === 'phoneNumber' && {borderColor: '#515FDF'},
              ]}
              onFocus={() => setFocusedInput('phoneNumber')}
              onBlur={() => setFocusedInput(null)}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              placeholder={
                userProfile?.phone_number || 'Enter your phone number'
              }
              placeholderTextColor="#00000060"
              keyboardType="numeric"
            />
            {phoneNumberError && (
              <Text style={styles.errorText}>{phoneNumberError}</Text>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                emailError && {borderColor: 'red'},
                focusedInput === 'email' && {borderColor: '#515FDF'},
              ]}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              value={email}
              onChangeText={handleEmailChange}
              placeholder={userProfile?.email || 'Enter your email'}
              placeholderTextColor="#00000060"
              keyboardType="email-address"
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#515FDF'}]}
            onPress={handleProfileUpdate}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 0.3,
    borderColor: '#666666',
    color: '#666',
    padding: 10,
    borderRadius: 6,
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    height: 55,
    marginTop: -4,
    width: '100%',
    marginBottom: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateProfile;

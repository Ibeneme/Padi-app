import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Linking, // Import ActivityIndicator
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import NewDropDown from '../Wallet/NewCalendar';
import axios from 'axios';
import {NEW_BASE_URL} from '../../Redux/NewBaseurl/NewBaseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';

const BecomeADriver = () => {
  const navigation = useNavigation();
  const [carVideoUri, setCarVideoUri] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [DOBErr, setDOBErr] = useState('');
  const [errors, setErrors] = useState({
    licenseNumber: '',
    carVideo: '',
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const selectVideo = () => {
    launchImageLibrary(
      {mediaType: 'video', quality: 0.5, selectionLimit: 1},
      response => {
        if (response.assets && response.assets.length > 0) {
          const selectedVideo = response.assets[0];
          setCarVideoUri(selectedVideo.uri);
        }
      },
    );
  };

  const handleYearChange = year => setSelectedYear(year);
  const handleMonthChange = month => setSelectedMonth(month);
  const handleDayChange = day => setSelectedDay(day);

  const formattedDate =
    selectedYear && selectedMonth && selectedDay
      ? `${selectedYear.value}-${selectedMonth.value.padStart(
          2,
          '0',
        )}-${selectedDay.value.padStart(2, '0')}`
      : '';

  const validateForm = () => {
    let formValid = true;
    const newErrors = {licenseNumber: '', carVideo: ''};

    if (!licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
      formValid = false;
    }

    if (!formattedDate) {
      setDOBErr('Date of Birth is required');
      formValid = false;
    } else {
      setDOBErr('');
    }

    if (!carVideoUri) {
      newErrors.carVideo = 'Please upload a video of the car.';
      formValid = false;
    }

    setErrors(newErrors);
    return formValid;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true); // Start loading

    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        alert('User not logged in. Please log in first.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('licenseNumber', licenseNumber);
      formData.append('dateOfBirth', formattedDate);
      formData.append('user_id', user_id);

      if (carVideoUri) {
        formData.append('video', {
          uri: carVideoUri,
          name: 'car_video.mp4',
          type: 'video/mp4',
        });
      }

      const response = await axios.post(
        `${NEW_BASE_URL}/api/backblaze/become-a-driver`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        // Show alert with OK button
        Alert.Linking,
          alert(
            'Success',
            'Form submitted successfully',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(), // Navigate back on OK press
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log('Error submitting form:', error);
      Alert.alert(
        'Form Submission Error',
        'An error occurred while submitting the form. Would you like to send us a mail?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Send us a mail',
            onPress: () => Linking.openURL('mailto:ibenemeikenna96@gmail.com'),
          },
        ],
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView style={{flexGrow: 1}}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>

          <Text style={styles.title}>Become a Driver</Text>
        </View>

        <View style={{padding: 16}}>
          <Text style={styles.label}>License Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your license number"
            placeholderTextColor="#a9a9a9"
            onChangeText={setLicenseNumber}
            value={licenseNumber}
          />
          {errors.licenseNumber && (
            <Text style={styles.error}>{errors.licenseNumber}</Text>
          )}

          <Text style={styles.label}>Date of Birth</Text>
          <NewDropDown
            onYearChange={handleYearChange}
            onMonthChange={handleMonthChange}
            onDayChange={handleDayChange}
          />
          {DOBErr && <Text style={styles.error}>{DOBErr}</Text>}

          <Text style={styles.label}>Upload Car Video</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={selectVideo}>
            <Text style={styles.uploadButtonText}>Upload Car Video</Text>
          </TouchableOpacity>

          {carVideoUri && (
            <View style={styles.videoPreviewContainer}>
              <Video
                source={{uri: carVideoUri}}
                style={styles.video}
                resizeMode="cover"
                controls={true}
              />
            </View>
          )}

          {errors.carVideo && (
            <Text style={styles.error}>{errors.carVideo}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && {backgroundColor: '#cccccc'},
            ]}
            onPress={handleFormSubmit}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20, flex: 1},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'Plus Jakarta Sans Bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Plus Jakarta Sans Regular',
    marginTop: 28,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  uploadButton: {
    backgroundColor: '#515FDF12',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
  },
  uploadButtonText: {
    color: '#515FDF',
    fontWeight: '600',
  },
  videoPreviewContainer: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    marginTop: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  submitButton: {
    backgroundColor: '#515FDF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BecomeADriver;

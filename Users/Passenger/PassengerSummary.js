import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {driverRequest} from '../../Redux/Ride/Ride';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserById} from '../../Redux/Auth/Auth';
import {createDriver} from '../../Redux/Auth/driverSlice';

const PassengerSummary = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [Err, setERR] = useState('');

  const route = useRoute();
  const {
    destination,
    date,
    currentCity,
    noOfPassengers,
    preferredTakeOff,
    dropOff,
    timeOfTakeOff,
    plateNo,
  } = route.params;
  const [userProfile, setUserProfile] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          //console.log(storedUserId, 'storedUserId')
          if (storedUserId) {
            const response = await dispatch(
              fetchUserById(storedUserId),
            ).unwrap();
            setUserProfile(response);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchData();
    }, [dispatch]),
  );
  console.log(userProfile, 'storedUserId');

  const handleDeliverParcel = () => {
    setModalVisible(true);

    // Format the date correctly
    const formattedDate = new Date(date).toISOString().split('T')[0];

    // Prepare the payload for the API request
    const payload = {
      destination: destination?.value,
      travelling_date: formattedDate,
      current_city: currentCity?.value,
      no_of_passengers: noOfPassengers,
      preferred_take_off: preferredTakeOff?.value,
      drop_off: dropOff?.value,
      time_of_take_off: timeOfTakeOff,
      plate_no: JSON.stringify(plateNo),
      userId: userProfile?._id,
      user_first_name: userProfile?.first_name,
      user_last_name: userProfile?.last_name,
      users_phone_number: userProfile?.phone_number,
    };

    // Log the payload for debugging
    console.log('Payload:', payload);

    // Dispatch the action to create a driver
    dispatch(createDriver(payload))
      .then(response => {
        // Log the response for debugging
        console.log('Response:', response);

        // Check if the response indicates success
        if (response?.payload?.success) {
          navigation.navigate('RideSuccess');
        } else {
          // Log the error from the response if it exists
          console.error(
            'Response Error:',
            response?.payload?.error || 'Failed to deliver parcel',
          );
          //setErr('Failed to deliver parcel');
        }
      })
      .catch(error => {
        console.error('Error delivering parcel:', error);
        //setErr('An error occurred while delivering the parcel. Please try again.');
      })
      .finally(() => {
        // Hide the modal regardless of success or failure
        setModalVisible(false);
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Passenger Summary',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTitleStyle: {
        color: '#000',
        borderBottomWidth: 0,
        fontFamily: 'Plus Jakarta Sans Bold',
      },
      headerTintColor: '#000',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Icon name="truck-fill" size={20} color="#515FDF" />
          </View>
          <Text style={styles.headerText}>Passenger Summary</Text>
          <Text style={styles.subHeaderText}>
            Read Carefully before making request
          </Text>
        </View>
        {Err ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{Err}</Text>
          </View>
        ) : null}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Where are you driving to?</Text>
          <Text style={styles.info}>{destination?.value}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Which are you taking off from?</Text>
          <Text style={styles.info}>{currentCity?.value}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>What Date are you travelling</Text>
          <Text style={styles.info}>
            {new Date(date).toISOString().split('T')[0]}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>How many passengers do you need?</Text>
          <Text style={styles.info}>{noOfPassengers}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Plate Number</Text>
          <Text style={styles.info}>{plateNo}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            Clearly describe your preferred take off point
          </Text>
          <Text style={styles.info}>{preferredTakeOff?.value}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Specific takeoff time</Text>
          <Text style={styles.info}>{timeOfTakeOff}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Drop off points</Text>
          <Text style={styles.info}>{dropOff?.value}</Text>
        </View>
        {Err ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{Err} </Text>
          </View>
        ) : null}
        <View style={{marginBottom: 120}}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleDeliverParcel}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={modalVisible}
              size="large"
              color="#515FDF"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 16,
    paddingBottom: 24,
  },
  scrollView: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
  iconContainer: {
    backgroundColor: '#515FDF12',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 3333,
    marginTop: 48,
  },
  headerText: {
    fontSize: 15,
    fontFamily: 'Plus Jakarta Sans Bold',
    marginTop: 12,
  },
  subHeaderText: {
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#666',
    marginTop: 2,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#ff000015',
    padding: 12,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  infoContainer: {
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  info: {
    fontSize: 14,
    color: '#121212',
    lineHeight: 21,
    marginBottom: 24,
    fontFamily: 'Plus Jakarta Sans SemiBold',
  },
  nextButton: {
    color: '#515FDF',
    padding: 16,
    backgroundColor: '#515FDF',
    fontFamily: 'Plus Jakarta Sans Regular',
    borderRadius: 6,
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: 'white',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PassengerSummary;

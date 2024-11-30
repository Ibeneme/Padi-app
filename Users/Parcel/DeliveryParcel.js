import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  View,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
//import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
// import Checkbox from "expo-checkbox";
import {sendParcel} from '../../Redux/Deliveries/Deliveries';
import {useDispatch} from 'react-redux';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import Icon from 'react-native-remix-icon';
import {addParcel} from '../../Redux/Auth/deliverParcelSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserById} from '../../Redux/Auth/Auth';
import {createParcel} from '../../Redux/Auth/sendParcelSlice';

const DeliverySummaryParcel = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [travelTo, setTravelTo] = useState('');
  const [travelDates, setTravelDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [busStop, setBusStop] = useState('');
  const [dateWithoutTime, setdateWithoutTime] = useState('');
  const [err, setERR] = useState('');
  const [loading, setLoadin] = useState('');
  const route = useRoute();
  const dispatch = useDispatch();
  console.log('Route Params:', route.params);

  const {
    selectedState,
    selectedCity,
    travelDate,
    isFragile,
    isPerishable,
    gender,
    travelFrom,
    pickupTime,
    phoneNumber,
    date,
  } = route.params;

  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleDateString('en-GB');

  const [userProfile, setUserProfile] = useState('');
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          const storedAccessToken = await AsyncStorage.getItem('access_token');
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };

      getUserData();
    }, []),
  );
  console.log(userProfile, 'userProfileuserProfile');
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(fetchUserById(userId))
          .then(response => {
            setUserProfile(response?.payload);
          })
          .catch(error => {
            console.log('Error fetching user profile:', error);
          });
      }
    }, [dispatch, userId, accessToken]),
  );

  const handleEllipsisPress = () => {
    setModalVisible(true);
  };
  const handleEllipsisPressClose = () => {
    setModalVisible(false);
  };
  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };

  const navigation = useNavigation();
  const headerStyle = {
    backgroundColor: 'white',
  };

  const headerTitleStyle = {
    color: '#000',
    borderBottomWidth: 0,
  };

  const headerTintColor = '#000';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Parcel Summary',
      headerStyle,
      headerTitleStyle: {
        ...headerTitleStyle,
        fontFamily: 'Plus Jakarta Sans Bold',
      },
      headerTintColor,
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  const handleTravelToChange = text => {
    setTravelTo(text);
    if (text === 'Overseas') {
      Alert.alert('Coming Soon');
    }
  };

  const handleDeliverParcel = () => {
    setLoadin(true);
    const formattedDate = new Date(date).toISOString().split('T')[0];
    console.log(formattedDate, 'formattedDate');
    const payload = {
      state: selectedState?.value,
      sender_city: selectedCity?.value,
      receiver_city: travelDate?.value,
      delivery_date: formattedDate,
      is_perishable: isFragile?.value,
      is_fragile: isPerishable?.value,
      receiver_name: travelFrom,
      receiver_phone: phoneNumber,
      receiver_email: pickupTime,
      receiver_gender: gender?.value,
      userId: userProfile?._id,
      user_first_name: userProfile?.first_name,
      user_last_name: userProfile?.last_name,
      users_phone_number: userProfile?.phone_number,
    };

    console.log(payload, 'payload');

    // Dispatch the addParcel thunk
    dispatch(createParcel(payload))
      .unwrap()
      .then(response => {
        console.log('Parcel successfully delivered:', response);
        if (response.success === true) {
          navigation.navigate('SendersList', {
            passID: response?.data?._id,
            type: 'delivery',
          });
        }
        // Perform any additional actions, e.g., navigation or clearing form
      })
      .catch(error => {
        console.log('Error delivering parcel:', error);
      })
      .finally(() => {
        setLoadin(false);
      });
  };

  // dispatch(sendParcel(payload))
  // .then(result => {
  //   setLoadin(false);
  //   console.log('Parcel delivered successfully:', result);
  //   console.log(JSON.stringify(result, null, 2));
  //   if (result?.meta?.requestStatus === 'fulfilled') {
  //     const passID = result?.payload?.detials?.send_parcel_id;
  //     console.log(passID);
  //     navigation.navigate('SendersList', { passID });
  //   } else {
  //     setERR('Please go back and fill your details correctly');
  //   }
  //   //navigation.navigate("TravellersDetails")
  //   //navigation.navigate("DeliverySuccess")
  // })
  // .catch(error => {
  //   setLoadin(false);
  //   console.error('Error delivering parcel:', error);
  // });

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
        flexGrow: 1,
        paddingTop: 16,
        paddingBottom: 24,
        height: '100%',
        marginBottom: -96,
      }}>
      <ScrollView
        style={{
          backgroundColor: 'white',
          flex: 1,
          flexGrow: 1,
          padding: 16,
        }}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: '#515FDF12',
              justifyContent: 'center',
              alignItems: 'center',
              width: 48,
              height: 48,
              borderRadius: 3333,
              marginTop: 48,
            }}>
            <Icon name="truck-fill" size={18} color="#515FDF" />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Plus Jakarta Sans SemiBold',
              marginTop: 12,
            }}>
            Parcel Summary
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: 'gray',
              marginTop: 2,
              marginBottom: 8,
            }}>
            Read Carefully before making request
          </Text>
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Which State do you reside?
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {selectedState?.value}
          </Text>
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Which city are you traveling to?
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {selectedCity?.value}
          </Text>
        </View>

        {/* Travel Date */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Where's your delivery City?
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {travelDate?.value}
          </Text>
        </View>

        {/* Arrival Date */}

        {/* Arrival Time */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Is the parcel perishable?{' '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {isFragile?.value === 'true' ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Bus Stop */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Is the Parcel Perishable?{' '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {isPerishable?.value === 'true' ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Travel From */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Name of Receiver{' '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {travelFrom}
          </Text>
        </View>

        {/* Pickup Location */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Gender of Receiver
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {gender?.value}
          </Text>
        </View>

        {/* Pickup Time */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Email Address of Receiver
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {pickupTime}
          </Text>
        </View>
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Phone Number of Receiver
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {phoneNumber}
          </Text>
        </View>
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Date of Delivery
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#121212',
              lineHeight: 21,
              marginBottom: 8,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {formattedDate}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{
              color: '#515FDF',
              padding: 16,
              backgroundColor: '#515FDF',
              fontFamily: 'Plus Jakarta Sans Regular',
              borderRadius: 6,
              marginTop: 48,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 200,
            }}
            onPress={handleDeliverParcel}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Plus Jakarta Sans Regular',
                color: 'white',
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeliverySummaryParcel;
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#00000050',
    flex: 1,
    flexGrow: 1,
    bottom: 0,
    position: 'relative',
  },
  modalContainerView: {
    paddingTop: 32,
    paddingBottom: 96,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    backgroundColor: '#ffff',
    borderRadius: 21,
    padding: 16,
    gap: 24,
    // alignItems: "center",
    //justifyContent: "center",
  },
  textInput: {
    height: 50,
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  checkbox: {},
});

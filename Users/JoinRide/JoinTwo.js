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
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
// import Checkbox from "expo-checkbox";
import {passengersRequest} from '../../Redux/Ride/Ride';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback} from 'react';
import {createPassengerRequest} from '../../Redux/Auth/passengerSlice';
import {fetchUserById} from '../../Redux/Auth/Auth';

const RideSummary = () => {
  const handleEllipsisPress = () => {
    setModalVisible(true);
  };
  const dispatch = useDispatch();
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
  const route = useRoute();
  const [Err, setERR] = useState('');
  const {destination, travelling_date, current_city} = route.params;
  const [loading, setLoadin] = useState('');
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Ride Summary',
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

  const handleDeliverParcel = () => {
    setLoadin(true);
    const formattedDate = new Date(travelling_date).toISOString().split('T')[0];
    console.log(formattedDate, 'formattedDate');

    const payload = {
      destination: destination,
      travelling_date: formattedDate,
      current_city: current_city,
      userId: userProfile?._id,
      user_first_name: userProfile?.first_name,
      user_last_name: userProfile?.last_name,
      users_phone_number: userProfile?.phone_number,
    };

    console.log(payload, 'payload');
    dispatch(createPassengerRequest(payload))
      .then(result => {
        setLoadin(false);
        console.log('Parcel delivered successfully:', result);
        if (result.payload.success) {
          const passID = result?.payload?.data?._id;
          navigation.navigate('SendersList', {passID, type: 'ride'});
        } else {
          setERR('Please go back and fill your details correctly');
        }
      })
      .catch(error => {
        setLoadin(false);
        console.error('Error delivering parcel:', error);
      });
  };

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
          //margin: 12,
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
            <Icon name="truck-fill" size={24} color="#515FDF" />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Plus Jakarta Sans Bold',
              color: '#121212',
              fontFamily: 'Plus Jakarta Sans Bold',
              marginTop: 12,
            }}>
            Ride Summary
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
              marginTop: 2,
              marginBottom: 24,
            }}>
            Read Carefully before making request
          </Text>
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            Where are you travelling from?
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#121212',
              fontFamily: 'Plus Jakarta Sans Bold',
              lineHeight: 21,
              marginBottom: 24,
            }}>
            {destination}
          </Text>
        </View>
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What date are you travelling?
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#121212',
              fontFamily: 'Plus Jakarta Sans Bold',
              lineHeight: 21,
              marginBottom: 24,
            }}>
            {travelling_date}
          </Text>
        </View>
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            Which city are you traveling from?
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#121212',
              fontFamily: 'Plus Jakarta Sans Bold',
              lineHeight: 21,
              marginBottom: 24,
            }}>
            {current_city}
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
                color: '#666666',
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

export default RideSummary;
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

import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserById} from '../../Redux/Auth/Auth';
import {addParcel} from '../../Redux/Auth/deliverParcelSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const DeliverySummary = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const {
    CountryTravelledTo,
    StatesTravelledTo,
    CityTravelledTo,
    DateTravelling,
    DateArrival,
    preferredBusStop,
    cityOfTravel,
    preferredPickupLocation,
    minprice,
    maxprice,
    lightParcelChecked,
    heavyParcelChecked,
  } = route.params;

  // Fetch user profile on component mount
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
  const handleDeliverParcel = async () => {
    setLoading(true);
    try {
      const payload = {
        country: CountryTravelledTo,
        state: StatesTravelledTo,
        destination: StatesTravelledTo,
        city: CityTravelledTo?.label,
        travel_date: DateTravelling,
        arrival_date: DateArrival,
        bus_stop: preferredBusStop,
        can_carry_light: lightParcelChecked === true ? true : false,
        can_carry_heavy: heavyParcelChecked === true ? true : false,
        min_price: minprice,
        max_price: maxprice,
        userId: userProfile?._id,
        user_first_name: userProfile?.first_name,
        user_last_name: userProfile?.last_name,
        users_phone_number: userProfile?.phone_number,
      };

      const response = await dispatch(addParcel(payload)).unwrap();
      console.log('Response from addParcel:', response);

      if (response?.message === 'Parcel added successfully') {
        Alert.alert('Success', 'Parcel successfully delivered!');
        navigation.navigate('DeliverySuccess');
      }
      //Alert.alert('Success', 'Parcel successfully delivered!');
      // navigation.navigate('DeliverySuccess');
    } catch (error) {
      console.error('Error delivering parcel:', error);
      Alert.alert('Error', 'Failed to deliver parcel. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  console.log(lightParcelChecked, 'lightPjjarcelChecked');
  const DetailRow = ({label, value}) => (
    <View style={{marginTop: 24}}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 16}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftSVG width={16} height={16} color="#515FDF" />
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="truck-fill" size={24} color="#515FDF" />
          </View>
          <Text style={styles.title}>Delivery Summary</Text>
          <Text style={styles.subtitle}>
            Read Carefully before making request
          </Text>
        </View>

        <DetailRow
          label="Where are you traveling to?"
          value={CountryTravelledTo}
        />
        <DetailRow
          label="Which state are you traveling to?"
          value={StatesTravelledTo}
        />
        <DetailRow
          label="Which city are you traveling to?"
          value={CityTravelledTo?.label}
        />
        <DetailRow label="Travel date" value={DateTravelling} />
        <DetailRow label="Arrival date" value={DateArrival} />
        <DetailRow label="Preferred bus stop" value={preferredBusStop} />
        <DetailRow label="City traveling from" value={cityOfTravel} />
        <DetailRow
          label="Preferred pickup location"
          value={preferredPickupLocation}
        />
        <DetailRow label="Preferred bus stop" value={minprice} />
        <DetailRow label="City traveling from" value={maxprice} />
        <DetailRow
          label="Can carry light parcel"
          value={lightParcelChecked === true ? 'Yes' : 'No'}
        />
        <DetailRow
          label="Can carry heavy parcel"
          value={heavyParcelChecked === true ? 'Yes' : 'No'}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleDeliverParcel}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Confirm Delivery'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    flex: 1,
    // padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  iconContainer: {
    backgroundColor: '#515FDF12',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans SemiBold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: 'gray',
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: 'gray',
    lineHeight: 21,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans SemiBold',
  },
  button: {
    backgroundColor: '#515FDF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
  },
};

export default DeliverySummary;

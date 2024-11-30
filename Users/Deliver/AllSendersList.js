import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {listParcelDrivers, listDrivers} from '../../Redux/Deliveries/Parcels';
import {useDispatch} from 'react-redux';
import {fetchUserProfile} from '../../Redux/Users/User';
import {useRoute} from '@react-navigation/native';
import {fetchDeliveries} from '../../Redux/Deliveries/Deliveries';
import {listAllDrivers} from '../../Redux/Ride/Ride';
import {fetchUserParcels} from '../../Redux/Auth/deliverParcelSlice';
import {fetchDrivers} from '../../Redux/Auth/driverSlice';

const SendersList = ({navigation}) => {
  const [drivers, setDrivers] = useState('');
  const [travel, setTravelers] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  const {fontScale, height} = useWindowDimensions();
  const dispatch = useDispatch();
  const route = useRoute();

  const {passID, type} = route.params;
  console.log(passID, type, 'passID, type');

  useEffect(() => {
    setLoading(true); // Start loading
    if (type === 'delivery') {
      dispatch(fetchUserParcels())
        .then(response => {
          console.log(response, 'console.log console.log');
          if (Array.isArray(response?.payload)) {
            setTravelers(response.payload);
            console.log(response.payload, 'driversdriversdrivers');
          } else {
            console.error('Expected an array but got:', response?.payload);
            setTravelers([]); // Set to empty array if not an array
          }
        })
        .catch(error => {
          console.error('Error fetching drivers:', error);
          setDrivers([]); // Set to empty array on error
        })
        .finally(() => {
          setLoading(false); // Stop loading after fetching
        });
    } else if (type === 'ride') {
      dispatch(fetchDrivers())
        .then(response => {
          console.log(response, 'console.log console.log');
          if (Array.isArray(response?.payload?.data)) {
            setTravelers(response.payload.data);
            console.log(response.payload, 'driversdriversdrivers');
          } else {
            console.error('Expected an array but got:', response?.payload);
            setTravelers([]); // Set to empty array if not an array
          }
        })
        .catch(error => {
          console.error('Error fetching drivers:', error);
          setDrivers([]); // Set to empty array on error
        })
        .finally(() => {
          setLoading(false); // Stop loading after fetching
        });
    }
  }, [dispatch]);

  console.log(JSON.stringify({passID, travel}, null, 2));

  const formatDateWithSuffix = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'}); // Get first 3 letters of month
    const year = date.getFullYear();

    // Determine the suffix (st, nd, rd, th)
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return `${day}${suffix} ${month} ${year}`;
  };

  const renderTravelItem = item => (
    <View style={styles.card} key={item.id}>
      <Text style={[styles.priceText, {fontSize: 18 * fontScale}]}>
        {item.min_price} - {item.max_price}NGN
      </Text>
      <Text>{item.id}</Text>
      <View style={styles.flexRow}>
        {renderItemDetail('Destination', item.destination)}
        {renderDate('Travel Date', item.travel_date)}
        {renderDate('Arrival Date', item.arrival_date)}
      </View>
      <View style={styles.flexRow}>
        {renderItemDetail('State', item.state)}
        {renderItemDetail('City', item.city)}
        {renderItemDetail('Bus Stop', item.bus_stop)}
      </View>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => {
          console.log(type, 'type');
          const newChatID = `${item?._id}${passID}`; // Concatenate values
          navigation.navigate('ChatComponent', {
            chatID: newChatID,
            type: type,
            requestID: passID,
            item: item,
            driverID: item?._id,
            passenger: true,
            UserName: `${item?.user_first_name} ${item?.user_last_name}`, // Concatenate first and last names
          });
        }}>
        <Text style={[styles.buttonText, {fontSize: 14 * fontScale}]}>
          <Icon name="chat-3-fill" size={12.4} color="#fff" /> Send a Message
        </Text>
      </TouchableOpacity>

      <View style={styles.flexRow}>
        {renderTag(
          'Can Carry Light',
          item.can_carry_light ? 'Yes' : 'No',
          '#FA700C',
        )}
        {renderTag(
          'Can Carry Heavy',
          item.can_carry_heavy ? 'Yes' : 'No',
          '#FA0C7E',
        )}
      </View>
    </View>
  );

  const renderTravelItemRider = item => (
    <View style={styles.card} key={item.id}>
      <Text>{item.id}</Text>

      <View style={styles.flexRow}>
        {renderItemDetail(
          `Driver's Name`,
          `${item?.user_first_name} ${item?.user_last_name}`,
        )}
        {renderItemDetail(
          `Driver's average Rating`,
          <View style={{flexDirection: 'row'}}>
            {Array.from(
              {length: item?.average_driver_rating || 0},
              (_, index) => (
                <Text key={index} style={{fontSize: 16}}>
                  ⭐️
                </Text> // Filled stars
              ),
            )}
        
          </View>,
        )}
      </View>

      <View style={styles.flexRow}>
        {renderItemDetail('Destination', item.destination)}
        {renderItemDetail('Take Off', item.preferred_take_off)}
        {renderDate('Take Off Time', item.travelling_date)}
      </View>

      <View style={styles.flexRow}>
        {renderItemDetail('Drop Off', item.drop_off)}
        {renderItemDetail('Plate No', item.plate_no)}
        {renderItemDetail('Take Off Time', item.time_of_take_off)}
      </View>

      <View style={styles.flexRow}>
        {renderItemDetail('Current City', item.current_city)}
        {renderItemDetail('No of Passengers', item.no_of_passengers)}
      </View>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => {
          const newChatID = `${item?._id}${passID}`; // Concatenate values
          navigation.navigate('ChatComponent', {
            chatID: newChatID,
            type: type,
            requestID: passID,
            item: item,
            driverID: item?._id,
            passenger: true,
            UserName: `${item?.user_first_name} ${item?.user_last_name}`, // Concatenate first and last names
          });
        }}>
        <Text style={[styles.buttonText, {fontSize: 14 * fontScale}]}>
          <Icon name="chat-3-fill" size={12.4} color="#fff" /> Send a Message
        </Text>
      </TouchableOpacity>

      <View style={styles.flexRow}>
        {renderTag(
          'Can Carry Light',
          item.can_carry_light ? 'Yes' : 'No',
          '#FA700C',
        )}
        {renderTag(
          'Can Carry Heavy',
          item.can_carry_heavy ? 'Yes' : 'No',
          '#FA0C7E',
        )}
      </View>
    </View>
  );

  const renderItemDetail = (title, value) => (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const renderTag = (title, value, color) => (
    <View style={[styles.tagContainer, {backgroundColor: `${color}21`}]}>
      <Text style={[styles.tagText, {color}]}>
        {title}: {value}
      </Text>
    </View>
  );

  const renderDate = (title, date) => {
    const formattedDate = formatDateWithSuffix(date);
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.detailValue}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#515FDF" />
          </View>
        </View>
      </Modal>
      <View style={{padding: 16, paddingBottom: 120}}>
        <View>
          <TouchableOpacity
            onPress={() => {
              type === 'ride'
                ? navigation.navigate('JoinRide')
                : navigation.navigate('Deliver');
            }}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>
          <Text style={styles.title}>All Parcel Senders</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{height: height}}
          contentContainerStyle={{paddingnBottom: 0}}>
          <View style={{marginBottom: 120}}>
            {Array.isArray(travel) && travel?.length > 0 ? (
              travel
                ?.slice()
                ?.reverse()
                ?.map(item => {
                  if (type === 'ride') {
                    return renderTravelItemRider(item); // Render for ride type
                  } else if (type === 'delivery') {
                    return renderTravelItem(item); // Render for delivery type
                  }
                  return null; // Return nothing if neither condition is met
                })
            ) : (
              <View>
                <Text style={{fontFamily: 'Plus Jakarta Sans Regular'}}>
                  No travel items found...
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('TawkToChat')}
                  style={[styles.flex, {marginTop: 120}]}>
                  <View
                    style={{
                      backgroundColor: '#515FDF12',
                      padding: 10,
                      borderRadius: 245,
                    }}>
                    <Icon
                      name="wallet-fill"
                      size={18}
                      width={20}
                      color="#515FDF"
                    />
                  </View>
                  <Text
                    style={[
                      styles.title,
                      {marginTop: 0, marginBottom: 0, fontSize: 14},
                    ]}>
                    Contact Support to Pair you up
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{marginBottom: 120}}></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Plus Jakarta Sans Bold',
    marginTop: 32,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#000',
    alignSelf: 'flex-end',
  },
  detailContainer: {
    marginTop: 24,
  },
  detailTitle: {
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#121212',
    fontSize: 12,
  },
  detailValue: {
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#666',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },
  flexRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  tagContainer: {
    padding: 12,
    borderRadius: 344,
    marginTop: 10,
    paddingHorizontal: 24,
  },
  tagText: {
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 12,
  },
  messageButton: {
    backgroundColor: '#515FDF',
    padding: 16,
    alignSelf: 'flex-end',
    borderRadius: 6,
    marginTop: 16,
  },
  buttonText: {
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#fff',
  },
  datesContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  dateText: {
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#515FDF',
    fontSize: 11,
    backgroundColor: '#515FDF12',
    padding: 12,
  },
  driverText: {
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#666',
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  loadingContainer: {
    backgroundColor: '#fff',
    width: '90%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default SendersList;

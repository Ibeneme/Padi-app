import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {listParcelDrivers} from '../../Redux/Deliveries/Parcels';
import {useDispatch} from 'react-redux';
import { listDrivers } from '../../Redux/Ride/Ride';

const travelData = [
  {
    id: 0,
    destination: 'string',
    travelling_date: '2024-07-06',
    current_city: 'string',
    no_of_passengers: 2147483647,
    preferred_take_off: 'string',
    time_of_take_off: 'string',
    drop_off: 'string',
  },
  // Add more travel objects here if needed
];

const driversData = [
  // Add driver objects here if needed
];

const GetDrivers = ({navigation}) => {
  const [drivers, setDrivers] = useState(driversData);
  const {fontScale, height} = useWindowDimensions();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listDrivers())
      .then(response => {
        setDrivers(response?.payload);
        console.log(response.payload.data, 'Drivers fetched');
      })
      .catch(error => {
        console.log(error, 'Error fetching drivers');
      });
  }, [dispatch]);

  const renderTravelItem = item => (
    <View style={styles.card} key={item.id}>
      {renderItemDetail('Destination', item.destination)}
      {renderItemDetail('Travelling Date', item.travelling_date)}
      {renderItemDetail('Current City', item.current_city)}
      {renderItemDetail('Number of Passengers', item.no_of_passengers)}
      {renderItemDetail('Preferred Take Off', item.preferred_take_off)}
      {renderItemDetail('Time of Take Off', item.time_of_take_off)}
      {renderItemDetail('Drop Off', item.drop_off)}

      <TouchableOpacity style={styles.messageButton}>
        <Text style={[styles.buttonText, {fontSize: 14 * fontScale}]}>
          <Icon name="chat-3-fill" size={12.4} color="#fff" /> Send a Message
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDriverItem = item => (
    <View style={styles.card} key={item.id}>
      <Text style={styles.driverText}>Driver Name: {item.name}</Text>
      <Text style={styles.driverText}>Driver Phone: {item.phone}</Text>
      <Text style={styles.driverText}>Driver Email: {item.email}</Text>
    </View>
  );

  const renderItemDetail = (title, value) => (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 16, paddingBottom: 120}}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>
          <Text style={styles.title}>All Riders</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{height: height}}>
          {travelData.map(renderTravelItem)}
          {/* {drivers.length > 0 ? (
            // drivers.map(renderDriverItem)
          ) : (
            // <Text>No drivers found...</Text>
          )} */}
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
  driverText: {
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#666',
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
});

export default GetDrivers;

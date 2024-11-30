import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';

const sampleDeliverParcel = [
  {
    id: 0,
    destination: "Destination A",
    country: "Country A",
    state: "State A",
    city: "City A",
    travel_date: "2024-07-05",
    arrival_date: "2024-07-05",
    bus_stop: "Bus Stop A",
    can_carry_light: true,
    can_carry_heavy: true,
    min_price: 10,
    max_price: 20,
  },
];

const sampleSendParcel = [
  {
    id: 0,
    state: "State B",
    sender_city: "City B",
    receiver_city: "City C",
    delivery_date: "2024-07-05",
    is_perishable: true,
    is_fragile: true,
    receiver_name: "Receiver A",
    receiver_phone: "1234567890",
    receiver_email: "receiver@mail.com",
    receiver_gender: "Male",
  },
];

const sampleOfferRide = [
  {
    id: 0,
    origin: "Origin A",
    destination: "Destination B",
    departure_date: "2024-07-05",
    available_seats: 3,
    price_per_seat: 15,
  },
];

const sampleJoinRide = [
  {
    id: 0,
    origin: "Origin B",
    destination: "Destination C",
    travel_date: "2024-07-05",
    seats_needed: 1,
    max_price: 20,
  },
];

const RequestList = () => {
  const [showDeliverParcel, setShowDeliverParcel] = useState(true);
  const [showSendParcel, setShowSendParcel] = useState(false);
  const [showOfferRide, setShowOfferRide] = useState(false);
  const [showJoinRide, setShowJoinRide] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <View style={styles.toggle}>
          <Text>Deliver a Parcel</Text>
          <Switch
            value={showDeliverParcel}
            onValueChange={value => setShowDeliverParcel(value)}
          />
        </View>
        <View style={styles.toggle}>
          <Text>Send a Parcel</Text>
          <Switch
            value={showSendParcel}
            onValueChange={value => setShowSendParcel(value)}
          />
        </View>
        <View style={styles.toggle}>
          <Text>Offer a Ride</Text>
          <Switch
            value={showOfferRide}
            onValueChange={value => setShowOfferRide(value)}
          />
        </View>
        <View style={styles.toggle}>
          <Text>Join a Ride</Text>
          <Switch
            value={showJoinRide}
            onValueChange={value => setShowJoinRide(value)}
          />
        </View>
      </View>
      <ScrollView style={styles.listContainer}>
        {showDeliverParcel && (
          <FlatList
            data={sampleDeliverParcel}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text>Destination: {item.destination}</Text>
                <Text>Country: {item.country}</Text>
                <Text>State: {item.state}</Text>
                <Text>City: {item.city}</Text>
                <Text>Travel Date: {item.travel_date}</Text>
                <Text>Arrival Date: {item.arrival_date}</Text>
                <Text>Bus Stop: {item.bus_stop}</Text>
                <Text>Can Carry Light: {item.can_carry_light ? "Yes" : "No"}</Text>
                <Text>Can Carry Heavy: {item.can_carry_heavy ? "Yes" : "No"}</Text>
                <Text>Min Price: {item.min_price}</Text>
                <Text>Max Price: {item.max_price}</Text>
              </View>
            )}
          />
        )}
        {showSendParcel && (
          <FlatList
            data={sampleSendParcel}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text>State: {item.state}</Text>
                <Text>Sender City: {item.sender_city}</Text>
                <Text>Receiver City: {item.receiver_city}</Text>
                <Text>Delivery Date: {item.delivery_date}</Text>
                <Text>Is Perishable: {item.is_perishable ? "Yes" : "No"}</Text>
                <Text>Is Fragile: {item.is_fragile ? "Yes" : "No"}</Text>
                <Text>Receiver Name: {item.receiver_name}</Text>
                <Text>Receiver Phone: {item.receiver_phone}</Text>
                <Text>Receiver Email: {item.receiver_email}</Text>
                <Text>Receiver Gender: {item.receiver_gender}</Text>
              </View>
            )}
          />
        )}
        {showOfferRide && (
          <FlatList
            data={sampleOfferRide}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text>Origin: {item.origin}</Text>
                <Text>Destination: {item.destination}</Text>
                <Text>Departure Date: {item.departure_date}</Text>
                <Text>Available Seats: {item.available_seats}</Text>
                <Text>Price Per Seat: {item.price_per_seat}</Text>
              </View>
            )}
          />
        )}
        {showJoinRide && (
          <FlatList
            data={sampleJoinRide}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text>Origin: {item.origin}</Text>
                <Text>Destination: {item.destination}</Text>
                <Text>Travel Date: {item.travel_date}</Text>
                <Text>Seats Needed: {item.seats_needed}</Text>
                <Text>Max Price: {item.max_price}</Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});

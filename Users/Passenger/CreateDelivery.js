import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {nigeriaStates, Country} from './data'; // Assuming these are your data sources for the dropdowns
import ThreeDropdowns from '../Wallet/CalendarDropdown';

export const nigeriaCities = [
  {label: 'Umuahia', value: 'Umuahia'}, // Abia
  {label: 'Yola', value: 'Yola'}, // Adamawa
  {label: 'Uyo', value: 'Uyo'}, // Akwa Ibom
  {label: 'Awka', value: 'Awka'}, // Anambra
  {label: 'Bauchi', value: 'Bauchi'}, // Bauchi
  {label: 'Yenagoa', value: 'Yenagoa'}, // Bayelsa
  {label: 'Makurdi', value: 'Makurdi'}, // Benue
  {label: 'Maiduguri', value: 'Maiduguri'}, // Borno
  {label: 'Calabar', value: 'Calabar'}, // Cross River
  {label: 'Asaba', value: 'Asaba'}, // Delta
  {label: 'Abakaliki', value: 'Abakaliki'}, // Ebonyi
  {label: 'Benin City', value: 'Benin City'}, // Edo
  {label: 'Ado Ekiti', value: 'Ado Ekiti'}, // Ekiti
  {label: 'Enugu', value: 'Enugu'}, // Enugu
  {label: 'Abuja', value: 'Abuja'}, // FCT - Abuja
  {label: 'Gombe', value: 'Gombe'}, // Gombe
  {label: 'Owerri', value: 'Owerri'}, // Imo
  {label: 'Dutse', value: 'Dutse'}, // Jigawa
  {label: 'Kaduna', value: 'Kaduna'}, // Kaduna
  {label: 'Kano', value: 'Kano'}, // Kano
  {label: 'Katsina', value: 'Katsina'}, // Katsina
  {label: 'Birnin Kebbi', value: 'Birnin Kebbi'}, // Kebbi
  {label: 'Lokoja', value: 'Lokoja'}, // Kogi
  {label: 'Ilorin', value: 'Ilorin'}, // Kwara
  {label: 'Ikeja', value: 'Ikeja'}, // Lagos
  {label: 'Lafia', value: 'Lafia'}, // Nasarawa
  {label: 'Minna', value: 'Minna'}, // Niger
  {label: 'Abeokuta', value: 'Abeokuta'}, // Ogun
  {label: 'Akure', value: 'Akure'}, // Ondo
  {label: 'Osogbo', value: 'Osogbo'}, // Osun
  {label: 'Ibadan', value: 'Ibadan'}, // Oyo
  {label: 'Jos', value: 'Jos'}, // Plateau
  {label: 'Port Harcourt', value: 'Port Harcourt'}, // Rivers
  {label: 'Sokoto', value: 'Sokoto'}, // Sokoto
  {label: 'Jalingo', value: 'Jalingo'}, // Taraba
  {label: 'Damaturu', value: 'Damaturu'}, // Yobe
  {label: 'Gusau', value: 'Gusau'}, // Zamfara
];
const hours = Array.from({length: 12}, (_, i) => i + 1).map(n => ({
  label: n.toString(),
  value: n.toString(),
}));
const minutes = Array.from({length: 60}, (_, i) =>
  i.toString().padStart(2, '0'),
).map(n => ({label: n, value: n}));
const amPm = [
  {label: 'AM', value: 'AM'},
  {label: 'PM', value: 'PM'},
];

const Passenger = () => {
  const navigation = useNavigation();
  const [destination, setDestination] = useState(null); // or ''
  const [currentCity, setCurrentCity] = useState(null); // or ''
  const [preferredTakeOff, setPreferredTakeOff] = useState(null); // or ''
  const [dropOff, setDropOff] = useState(null); // or ''
  const [travellingDate, setTravellingDate] = useState(new Date());
  //const [currentCity, setCurrentCity] = useState('');
  const [noOfPassengers, setNoOfPassengers] = useState('');
  //const [preferredTakeOff, setPreferredTakeOff] = useState('');
  const [timeHour, setTimeHour] = useState('');
  const [timeMinute, setTimeMinute] = useState('');
  const [timeAmPm, setTimeAmPm] = useState('AM');
  //const [dropOff, setDropOff] = useState('');
  const [plateNo, setPlateNo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const handleYearChange = year => {
    setSelectedYear(year);
  };

  const handleMonthChange = month => {
    setSelectedMonth(month);
  };

  const handleDayChange = day => {
    setSelectedDay(day);
  };

  const formattedDate =
    selectedYear && selectedMonth && selectedDay
      ? `${selectedYear.value}-${selectedMonth.value.padStart(
          2,
          '0',
        )}-${selectedDay.value.padStart(2, '0')}`
      : 'Please select a date';

  const handleEllipsisPress = useCallback(() => {
    console.log(
      destination?.value,
      currentCity?.value,
      noOfPassengers,
      preferredTakeOff?.value,
      `${timeHour}:${timeMinute} ${timeAmPm}`,
      dropOff?.value,
      travellingDate.toLocaleDateString('en-GB'),
      plateNo,
    );
    if (
      destination?.value?.trim() &&
      currentCity?.value?.trim() &&
      noOfPassengers?.trim() &&
      preferredTakeOff?.value?.trim() &&
      timeHour?.trim() &&
      timeMinute?.trim() &&
      timeAmPm?.trim() &&
      dropOff?.value?.trim() &&
      plateNo?.trim()
    ) {
      navigation.navigate('PassengerSummary', {
        destination,
        date: travellingDate,
        currentCity,
        noOfPassengers,
        preferredTakeOff,
        timeOfTakeOff: formattedDate,
        dropOff,
        plateNo,
      });
    } else {
      Alert.alert('Error', 'Please fill out all the fields');
    }
  }, [
    destination,
    travellingDate,
    currentCity,
    noOfPassengers,
    preferredTakeOff,
    timeHour,
    timeMinute,
    timeAmPm,
    dropOff,
    plateNo,
    navigation,
  ]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || travellingDate;
    setShowDatePicker(false);
    setTravellingDate(currentDate);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Carry a Passenger',
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Icon name="truck-fill" size={20} color="#515FDF" />
          </View>
          <Text style={styles.title}>Carry a Passenger</Text>
          <Text style={styles.subtitle}>Please fill out the form</Text>
        </View>

        {/* Destination */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Destination</Text>
          <Dropdown
            itemTextStyle={styles.dropdownItemText}
            itemContainerStyle={styles.dropdownItemContainer}
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={styles.dropdownPlaceholder}
            style={styles.textInput}
            data={nigeriaStates}
            labelField="label"
            valueField="value"
            placeholder="Enter Destination"
            value={destination}
            onChange={item => setDestination(item)}
          />
        </View>

        {/* Current City */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current City</Text>
          <Dropdown
            itemTextStyle={styles.dropdownItemText}
            itemContainerStyle={styles.dropdownItemContainer}
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={styles.dropdownPlaceholder}
            style={styles.textInput}
            data={nigeriaCities}
            labelField="label"
            valueField="value"
            placeholder="Enter Current City"
            value={currentCity}
            onChange={item => setCurrentCity(item)}
          />
        </View>

        {/* Travelling Date */}
        <View>
          <ThreeDropdowns
            onYearChange={handleYearChange}
            onMonthChange={handleMonthChange}
            onDayChange={handleDayChange}
          />
        </View>

        {/* Number of Passengers */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of Passengers</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Number of Passengers"
            placeholderTextColor="#1e1e1e45"
            value={noOfPassengers}
            onChangeText={setNoOfPassengers}
          />
        </View>

        {/* Preferred Take-Off Point */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preferred Take-Off Point</Text>
          <Dropdown
            itemTextStyle={styles.dropdownItemText}
            itemContainerStyle={styles.dropdownItemContainer}
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={styles.dropdownPlaceholder}
            style={styles.textInput}
            data={nigeriaCities}
            labelField="label"
            valueField="value"
            placeholder="Enter Preferred Take-Off Point"
            value={preferredTakeOff}
            onChange={item => setPreferredTakeOff(item)}
          />
        </View>

        {/* Time of Take-Off */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Time of Take-Off</Text>
          <View style={styles.timeContainer}>
            <Dropdown
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              placeholderTextColor="#1e1e1e45"
              placeholderStyle={styles.dropdownPlaceholder}
              style={styles.timeDropdown}
              data={hours}
              labelField="label"
              valueField="value"
              placeholder="Hour"
              value={timeHour}
              onChange={item => setTimeHour(item.value)}
            />
            <Dropdown
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              placeholderTextColor="#1e1e1e45"
              placeholderStyle={styles.dropdownPlaceholder}
              style={styles.timeDropdown}
              data={minutes}
              labelField="label"
              valueField="value"
              placeholder="Minute"
              value={timeMinute}
              onChange={item => setTimeMinute(item.value)}
            />
            <Dropdown
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              placeholderTextColor="#1e1e1e45"
              placeholderStyle={styles.dropdownPlaceholder}
              style={styles.timeDropdown}
              data={amPm}
              labelField="label"
              valueField="value"
              placeholder="AM/PM"
              value={timeAmPm}
              onChange={item => setTimeAmPm(item.value)}
            />
          </View>
        </View>

        {/* Drop Off */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Drop Off</Text>
          <Dropdown
            itemTextStyle={styles.dropdownItemText}
            itemContainerStyle={styles.dropdownItemContainer}
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={styles.dropdownPlaceholder}
            style={styles.textInput}
            data={nigeriaCities}
            labelField="label"
            valueField="value"
            placeholder="Enter Drop Off Point"
            value={dropOff}
            onChange={item => setDropOff(item)}
          />
        </View>

        {/* Plate Number */}
        {/* Plate Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vehicle Plate Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Plate Number"
            placeholderTextColor="#1e1e1e45"
            value={plateNo}
            onChangeText={setPlateNo}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleEllipsisPress}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 16,
  },
  iconContainer: {
    marginBottom: 32,
    marginTop: 32,
    backgroundColor: '#515FDF25',
    padding: 18,
    borderRadius: 120,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Plus Jakarta Sans Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Regular',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeDropdown: {
    flex: 1,
    marginRight: 8,
  },
  dropdownItemText: {
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  dropdownItemContainer: {
    paddingVertical: 8,
  },
  dropdownPlaceholder: {
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#1e1e1e45',
  },
  button: {
    backgroundColor: '#515FDF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 120,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Plus Jakarta Sans Medium',
    fontSize: 16,
  },
  text: {
    fontFamily: 'Plus Jakarta Sans Regular',
  },
});

export default Passenger;

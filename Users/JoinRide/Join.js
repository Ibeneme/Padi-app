import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import {nigeriaCities} from '../Passenger/CreateDelivery';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import ThreeDropdowns from '../Wallet/CalendarDropdown';

const CreateRide = () => {
  const navigation = useNavigation();
  const [travelTo, setTravelTo] = useState('');
  const [travelDate, setTravelDate] = useState(new Date());
  const [currentCity, setCurrentCity] = useState('');
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

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setTravelDate(currentDate);
  };

  const handleTravelToChange = text => {
    setTravelTo(text?.value);
  };

  const handleNextPress = () => {
    if (travelTo && travelDate && currentCity) {
      navigation.navigate('RideSummary', {
        destination: travelTo,
        travelling_date: formattedDate,
        current_city: currentCity?.value,
      });
    } else {
      alert('Please fill out all the fields');
    }
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
            <Icon name="car-fill" size={20} color="#515FDF" />
          </View>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Plus Jakarta Sans SemiBold',
              marginTop: 12,
            }}>
            Join a Ride
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: 'gray',
              marginTop: 2,
              marginBottom: 24,
            }}>
            Please fill out the form
          </Text>
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Where are you travelling from?
          </Text>

          <Dropdown
            style={[
              styles.textInput,
              {borderColor: '#66666665', borderWidth: 0.6},
            ]}
            itemTextStyle={{
              fontSize: 13,
              color: `#121212`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            itemContainerStyle={{
              backgroundColor: '#fff',
              borderRadius: 6,
            }}
            selectedTextStyle={{
              fontSize: 13,
              color: `#121212`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            data={nigeriaCities}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor={'#1e1e1e45'}
            value={travelTo}
            onChange={handleTravelToChange}
            placeholder="Select state"
          />
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Travelling Date
          </Text>
          <View>
            <ThreeDropdowns
              onYearChange={handleYearChange}
              onMonthChange={handleMonthChange}
              onDayChange={handleDayChange}
            />
          </View>
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666',
            }}>
            Which city are you traveling from?
          </Text>
          <Dropdown
            placeholderStyle={{fontSize: 13, color: '#666'}}
            style={[
              styles.textInput,
              {borderColor: '#66666665', borderWidth: 0.6},
            ]}
            itemTextStyle={{
              fontSize: 13,
              color: `#121212`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            itemContainerStyle={{
              backgroundColor: '#fff',
              borderRadius: 6,
            }}
            selectedTextStyle={{
              fontSize: 13,
              color: `#121212`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            data={nigeriaCities}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor={'#1e1e1e45'}
            value={currentCity}
            onChange={setCurrentCity}
            placeholder="Select city"
          />
        </View>

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
          onPress={handleNextPress}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans SemiBold',
              color: 'white',
            }}>
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 50,
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 13,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginTop: 6,
    marginBottom: 12,
  },
});

export default CreateRide;

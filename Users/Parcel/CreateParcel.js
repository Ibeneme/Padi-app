import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import ThreeDropdowns from '../Wallet/CalendarDropdown';

const CreateParcel = () => {
  const navigation = useNavigation();
  const currentDate = new Date();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [travelTo, setTravelTo] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isFragile, setIsFragile] = useState('');
  const [isPerishable, setIsPerishable] = useState('');
  const [gender, setGender] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [busStop, setBusStop] = useState('');
  const [travelFrom, setTravelFrom] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [err, setErr] = useState(false);
  const handleEllipsisPress = () => {
    setModalVisible(true);
  };

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

  console.log(selectedYear, selectedMonth, selectedDay, 'selectedMonth');


  const formattedDate =
    selectedYear && selectedMonth && selectedDay
      ? `${selectedYear.value}-${selectedMonth.value.padStart(
          2,
          '0',
        )}-${selectedDay.value.padStart(2, '0')}`
      : 'Please select a date';

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // For iOS, only show time picker
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
    setMode('date');
  };

  const handleEllipsisPressClose = () => {
    setModalVisible(false);
    navigation.navigate('DeliverySummaryParcel');
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
      title: 'Send a Parcel',
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
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleFormSubmit = () => {
    setErr(false);
    setEmailError(false);
    setPhoneError(false);

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(pickupTime)) {
      setEmailError(true);
      return; // Exit the function if email is invalid
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/; // Assuming a valid phone number has 10 digits
    // if (!phoneRegex.test(phoneNumber)) {
    if (!phoneNumber || phoneNumber.length <= 10) {
      setPhoneError(true);
      return; // Exit the function if phone number is empty
    }

    if (
      selectedState &&
      selectedCity &&
      travelDate &&
      isFragile !== '' && // Ensure isFragile is not an empty string
      isPerishable !== '' && // Ensure isPerishable is not an empty string
      gender &&
      travelFrom &&
      pickupTime &&
      phoneNumber &&
      formattedDate
    ) {
      // All fields are filled, proceed with submission logic
      navigation.navigate('DeliverySummaryParcel', {
        selectedState,
        selectedCity,
        travelDate,
        isFragile,
        isPerishable,
        gender,
        travelFrom,
        pickupTime,
        phoneNumber,
        date: formattedDate,
      });
    } else {
      console.log('dd');
      setErr(true);
    }
  };

  const nigeriaStates = [
    {
      label: 'Abia',
      value: 'Abia',
    },
    {
      label: 'Adamawa',
      value: 'Adamawa',
    },
    {
      label: 'Akwa Ibom',
      value: 'Akwa Ibom',
    },
    {
      label: 'Anambra',
      value: 'Anambra',
    },
    {
      label: 'Bauchi',
      value: 'Bauchi',
    },
    {
      label: 'Bayelsa',
      value: 'Bayelsa',
    },
    {
      label: 'Benue',
      value: 'Benue',
    },
    {
      label: 'Borno',
      value: 'Borno',
    },
    {
      label: 'Cross River',
      value: 'Cross River',
    },
    {
      label: 'Delta',
      value: 'Delta',
    },
    {
      label: 'Ebonyi',
      value: 'Ebonyi',
    },
    {
      label: 'Edo',
      value: 'Edo',
    },
    {
      label: 'Ekiti',
      value: 'Ekiti',
    },
    {
      label: 'Enugu',
      value: 'Enugu',
    },
    {
      label: 'FCT - Abuja',
      value: 'FCT - Abuja',
    },
    {
      label: 'Gombe',
      value: 'Gombe',
    },
    {
      label: 'Imo',
      value: 'Imo',
    },
    {
      label: 'Jigawa',
      value: 'Jigawa',
    },
    {
      label: 'Kaduna',
      value: 'Kaduna',
    },
    {
      label: 'Kano',
      value: 'Kano',
    },
    {
      label: 'Katsina',
      value: 'Katsina',
    },
    {
      label: 'Kebbi',
      value: 'Kebbi',
    },
    {
      label: 'Kogi',
      value: 'Kogi',
    },
    {
      label: 'Kwara',
      value: 'Kwara',
    },
    {
      label: 'Lagos',
      value: 'Lagos',
    },
    {
      label: 'Nasarawa',
      value: 'Nasarawa',
    },
    {
      label: 'Niger',
      value: 'Niger',
    },
    {
      label: 'Ogun',
      value: 'Ogun',
    },
    {
      label: 'Ondo',
      value: 'Ondo',
    },
    {
      label: 'Osun',
      value: 'Osun',
    },
    {
      label: 'Oyo',
      value: 'Oyo',
    },
    {
      label: 'Plateau',
      value: 'Plateau',
    },
    {
      label: 'Rivers',
      value: 'Rivers',
    },
    {
      label: 'Sokoto',
      value: 'Sokoto',
    },
    {
      label: 'Taraba',
      value: 'Taraba',
    },
    {
      label: 'Yobe',
      value: 'Yobe',
    },
    {
      label: 'Zamfara',
      value: 'Zamfara',
    },
  ];
  const nigeriaCities = [
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
            <Icon name="truck-fill" size={20} color="#515FDF" />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Plus Jakarta Sans Bold',
              marginTop: 12,
            }}>
            Send a Parcel
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: 'gray',
              marginTop: 2,
              marginBottom: 24,
            }}>
            Please fill out the form
          </Text>
        </View>
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Which State do you reside?
          </Text>
          <Dropdown
            itemTextStyle={{
              fontSize: 13,
              color: `#666`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            itemContainerStyle={{
              backgroundColor: '#ffffff',
            }}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={{
              fontFamily: 'Plus Jakarta Sans Regular',
              fontSize: 13,
              color: '#666',
            }}
            style={[
              styles.textInput,
              {
                borderColor: '#66666665',
                borderWidth: 0.6,
                color: '#666',
                fontSize: 13,
              },
            ]}
            data={nigeriaStates}
            value={selectedState}
            onChange={value => setSelectedState(value)}
          />
        </View>

        {/* Dropdown for "Which City are you traveling to?" */}
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Which City are you traveling to?
          </Text>
          <Dropdown
            itemTextStyle={{
              fontSize: 13,
              color: `#666`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            itemContainerStyle={{
              backgroundColor: '#ffffff',
            }}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={{
              fontFamily: 'Plus Jakarta Sans Regular',
              fontSize: 13,
              color: '#666',
            }}
            style={[
              styles.textInput,
              {
                borderColor: '#66666665',
                borderWidth: 0.6,
                color: '#666',
                fontSize: 13,
              },
            ]}
            data={nigeriaCities}
            value={selectedCity}
            onChange={value => setSelectedCity(value)}
          />
        </View>

        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Where's your delivery City?
          </Text>
          <Dropdown
            itemTextStyle={{
              fontSize: 13,
              color: `#666`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            itemContainerStyle={{
              backgroundColor: '#ffffff',
            }}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={{
              fontFamily: 'Plus Jakarta Sans Regular',
              fontSize: 13,
              color: '#666',
            }}
            style={[
              styles.textInput,
              {
                borderColor: '#66666665',
                borderWidth: 0.6,
                color: '#666',
                fontSize: 13,
              },
            ]}
            data={nigeriaCities}
            value={travelDate}
            onChange={value => setTravelDate(value)}
          />
        </View>

        {/* Dropdown for "Is the parcel fragile?" */}
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Is the parcel fragile?
          </Text>
          <Dropdown
            itemTextStyle={{
              fontSize: 13,
              color: `#666`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            itemContainerStyle={{
              backgroundColor: '#ffffff',
            }}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={{
              fontFamily: 'Plus Jakarta Sans Regular',
              fontSize: 13,
              color: '#666',
            }}
            style={[
              styles.textInput,
              {
                borderColor: '#66666665',
                borderWidth: 0.6,
                color: '#666',
                fontSize: 13,
              },
            ]}
            data={[
              {label: 'Yes', value: 'true'},
              {label: 'No', value: 'false'},
            ]}
            value={isFragile}
            onChange={value => setIsFragile(value)}
          />
        </View>

        {/* Dropdown for "Is the parcel perishable?" */}
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Is the parcel perishable?
          </Text>
          <Dropdown
            itemTextStyle={{
              fontSize: 13,
              color: `#666`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            itemContainerStyle={{
              backgroundColor: '#ffffff',
            }}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={{
              fontFamily: 'Plus Jakarta Sans Regular',
              fontSize: 13,
              color: '#666',
            }}
            style={[
              styles.textInput,
              {
                borderColor: '#66666665',
                borderWidth: 0.6,
                color: '#666',
                fontSize: 13,
              },
            ]}
            data={[
              {label: 'Yes', value: 'true'},
              {label: 'No', value: 'false'},
            ]}
            value={isPerishable}
            onChange={value => setIsPerishable(value)}
          />
        </View>

        {/* Dropdown for "Gender of Receiver" */}
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Gender of Receiver
          </Text>
          <Dropdown
            itemTextStyle={{
              fontSize: 13,
              color: `#666`,
              fontFamily: 'Plus Jakarta Sans Regular',
            }}
            itemContainerStyle={{
              backgroundColor: '#ffffff',
            }}
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor="#1e1e1e45"
            placeholderStyle={{
              fontFamily: 'Plus Jakarta Sans Regular',
              fontSize: 13,
              color: '#666',
            }}
            style={[
              styles.textInput,
              {
                borderColor: '#66666665',
                borderWidth: 0.6,
                color: '#666',
                fontSize: 13,
              },
            ]}
            data={[
              {label: 'Male', value: 'Male'},
              {label: 'Female', value: 'Female'},
            ]}
            value={gender}
            onChange={value => setGender(value)}
          />
        </View>

        {/* Travel From */}
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Name of Receiver
          </Text>
          <TextInput
            style={[styles.textInput]}
            value={travelFrom}
            onChangeText={text => setTravelFrom(text)}
            placeholder="Enter a name"
          />
        </View>

        {/* Pickup Time */}
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Email Address of Receiver
          </Text>
          <TextInput
            style={[styles.textInput, emailError && styles.errorInput]}
            value={pickupTime}
            onChangeText={text => setPickupTime(text)}
            placeholder="Enter an email address"
          />
          {emailError && (
            <Text
              style={{
                color: 'red',
                fontSize: 14,
                textAlign: 'left',
                fontFamily: 'Plus Jakarta Sans Medium',
                marginTop: -4,
                marginBottom: 16,
              }}>
              Invalid email address
            </Text>
          )}
        </View>

        {/* Phone Number */}
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Phone Number of Receiver
          </Text>
          <TextInput
            style={[styles.textInput, phoneError && styles.errorInput]}
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            placeholder="Enter a phone number"
            keyboardType="numeric"
          />
          {phoneError && (
            <Text
              style={{
                color: 'red',
                fontSize: 14,
                textAlign: 'left',
                fontFamily: 'Plus Jakarta Sans Medium',
                marginTop: -4,
                marginBottom: 16,
              }}>
              Invalid phone number
            </Text>
          )}
        </View>
        <View style={{marginTop: 24}}>
          <Text style={{fontSize: 13, fontFamily: 'Plus Jakarta Sans Regular'}}>
            Choose a Delivery Date
          </Text>
          <View>
            <ThreeDropdowns
              onYearChange={handleYearChange}
              onMonthChange={handleMonthChange}
              onDayChange={handleDayChange}
            />
       
          </View>

          {/* <View
            style={[
              styles.textInput,
              {
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Plus Jakarta Sans Medium',
                    color: `#000`,
                    fontSize: 13,
                  },
                ]}>{`${
                date ? date.toISOString().split('T')[0] : 'Choose Delivery date'
              }`}</Text>
            </View>
            <View>
              <Button onPress={showDatePicker} title="Choose Date" />
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  //mode="datetime"
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  minimumDate={currentDate}
                  timeZoneOffsetInMinutes={-60}
                />
              )}
            </View>
          </View> */}
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
              marginBottom: 16,
            }}
            onPress={handleFormSubmit}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Plus Jakarta Sans Bold',
                color: 'white',
              }}>
              Next
            </Text>
          </TouchableOpacity>

          {err && (
            <View
              style={{
                backgroundColor: '#ff000016',
                padding: 16,
                marginTop: 32,
              }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 14,
                  textAlign: 'center',
                  fontFamily: 'Plus Jakarta Sans Medium',
                }}>
                {' '}
                {err ? 'Complete All Forms to Proceed' : null}
              </Text>
            </View>
          )}

          <View style={{marginBottom: 400}}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateParcel;
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
    fontSize: 13,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginTop: 6,
    marginBottom: 12,
    color: '#666',
  },
  checkbox: {},
});

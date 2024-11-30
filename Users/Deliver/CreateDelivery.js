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
import CheckBox from 'react-native-check-box';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {states} from './States';
import Icon from 'react-native-remix-icon';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import ThreeDropdowns from '../Wallet/CalendarDropdown';

// import DateTimePicker from "@react-native-community/datetimepicker";

const CreateDelivery = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const [selectedYearArrival, setSelectedYearArrival] = useState('');
  const [selectedMonthArrival, setSelectedMonthArrival] = useState('');
  const [selectedDayArrival, setSelectedDayArrival] = useState('');

  const handleYearChange = year => {
    setSelectedYear(year);
  };

  const handleMonthChange = month => {
    setSelectedMonth(month);
  };

  const handleDayChange = day => {
    setSelectedDay(day);
  };

  const handleYearChangeArrival = year => {
    setSelectedYearArrival(year);
  };

  const handleMonthChangeArrival = month => {
    setSelectedMonthArrival(month);
  };

  const handleDayChangeArrival = day => {
    setSelectedDayArrival(day);
  };

  //Arrival
  console.log(selectedYear, selectedMonth, selectedDay, 'selectedMonth');

  const formattedDate =
    selectedYear && selectedMonth && selectedDay
      ? `${selectedYear.value}-${selectedMonth.value.padStart(
          2,
          '0',
        )}-${selectedDay.value.padStart(2, '0')}`
      : 'Please select a date';

  const formattedDateArrival =
    selectedYearArrival && selectedMonthArrival && selectedDayArrival
      ? `${selectedYearArrival.value}-${selectedMonthArrival?.value.padStart(
          2,
          '0',
        )}-${selectedDayArrival.value.padStart(2, '0')}`
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

  const showTimePicker = () => {
    setShow(true);
    setMode('time');
  };

  const [dateArrival, setDateArrival] = useState(new Date());
  const [modeArrival, setModeArrival] = useState('date');
  const [showArrival, setShowArrival] = useState(false);

  const onChangeArrival = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowArrival(Platform.OS === 'ios'); // For iOS, only show time picker
    setDateArrival(currentDate);
  };

  const showDatePickerArrival = () => {
    setShowArrival(true);
    setModeArrival('date');
  };

  const showTimePickerArrival = () => {
    setShowArrival(true);
    setModeArrival('time');
  };

  const [lightParcelChecked, setLightParcelChecked] = useState(false);
  const [heavyParcelChecked, setHeavyParcelChecked] = useState(false);

  console.log(
    lightParcelChecked,
    heavyParcelChecked,
    'heavyParcelCheckedheavyParcelChecked',
  );

  const handleSubmit = () => {
    setIsFormValid('');
    const DateTravellings = date;
    const inputDate = new Date(DateTravellings);
    const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = inputDate.getDate().toString().padStart(2, '0');
    //const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);

    const DateTravellingss = dateArrival;
    const inputDates = new Date(DateTravellingss);
    const years = inputDates.getFullYear();
    const months = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const days = inputDates.getDate().toString().padStart(2, '0');
    // const formattedDates = `${years}-${months}-${days}`;
    // console.log(formattedDates);

    const CountryTravelledTo = travelToCountry?.label;
    const StatesTravelledTo = travelTo?.label;
    const CityTravelledTo = selectedCity;
    const TimeOfTravel = DatetravelTo;
    const DateTravelling = formattedDate;
    const DateArrival = formattedDateArrival;
    const preferredBusStop = busStop;
    const cityOfTravel = travelFrom;
    const preferredPickupLocation = pickupLocation;
    const preferredPickupTime = pickupTime;

    console.log(
      CountryTravelledTo,
      StatesTravelledTo,
      CityTravelledTo,
      TimeOfTravel,
      DateTravelling,
      DateArrival,
      preferredBusStop,
      cityOfTravel,
      preferredPickupLocation,
      preferredPickupTime,
      lightParcelChecked,
      heavyParcelChecked,
      'JJJ',
    );

    setModalVisible(false);
    if (
      CountryTravelledTo &&
      // !== " "
      StatesTravelledTo &&
      // !== " "
      CityTravelledTo &&
      // !== " "
      TimeOfTravel &&
      // !== " "
      DateTravelling &&
      // !== " "
      DateArrival &&
      // !== " "
      preferredBusStop &&
      // !== " "
      cityOfTravel &&
      // !== " "
      preferredPickupLocation &&
      // !== " "
      preferredPickupTime
      // !== " "
    ) {
      navigation.navigate('DeliverySummary', {
        CountryTravelledTo: travelToCountry?.label,
        StatesTravelledTo: travelTo?.label,
        CityTravelledTo: selectedCity,
        TimeOfTravel: DatetravelTo,
        DateTravelling: formattedDate,
        DateArrival: formattedDateArrival,
        preferredBusStop: busStop,
        cityOfTravel: travelFrom,
        preferredPickupLocation: pickupLocation,
        preferredPickupTime: pickupTime,
        minprice: minprice,
        maxprice: maxprice,
        lightParcelChecked: lightParcelChecked === true ? true : false,
        heavyParcelChecked: heavyParcelChecked === true ? true : false,
      });
    } else {
      setIsFormValid('Fill all forms');
    }
  };
  const [isFormValid, setIsFormValid] = useState('');

  const validateForm = () => {
    // Implement your validation logic here
    if (
      travelToCountry &&
      travelTo &&
      selectedCity &&
      DatetravelTo &&
      travelDate &&
      arrivalTime &&
      busStop &&
      travelFrom &&
      pickupLocation &&
      pickupTime &&
      minprice &&
      maxprice
      // &&
      // (lightParcelChecked || heavyParcelChecked)
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const [minprice, setMinprice] = useState('');
  const [maxprice, setMaxprice] = useState('');

  const handleLightParcelToggle = () => {
    setIsFormValid('');
    setLightParcelChecked(true);
    setHeavyParcelChecked(false);
  };

  const handleHeavyParcelToggle = () => {
    setIsFormValid('');
    setLightParcelChecked(false);
    setHeavyParcelChecked(true);
  };

  const navigation = useNavigation();
  //const [showDatePicker, setShowDatePicker] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const currentDate = new Date();
  const [travelTo, setTravelTo] = useState('');
  const [travelToCountry, setTravelToCountry] = useState('');
  const [DatetravelTo, setDateTravelTo] = useState('');
  const [travelCity, setTravelCity] = useState('');

  const [travelDate, setTravelDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [busStop, setBusStop] = useState('');
  const [travelFrom, setTravelFrom] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const handleEllipsisPress = () => {
    setModalVisible(true);
  };
  const handleEllipsisPressClose = () => {
    setModalVisible(false);
    navigation.navigate('DeliverySummary');
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
      title: "Deliver Someone's  Parcel",
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

  const handleParcelToggle = type => {
    if (type === 'light') {
      setLightParcelChecked(true);
      setHeavyParcelChecked(false);
    } else if (type === 'heavy') {
      setLightParcelChecked(false);
      setHeavyParcelChecked(true);
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

  const Country = [
    {
      label: 'Nigeria',
      value: 'Nigeria',
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

  const handleCountryStatesChange = travelTo => {
    setIsFormValid('');
    setTravelTo(travelTo);
    console.log(travelTo, 'travel');
  };

  const handleCountryChange = travelToCountry => {
    setIsFormValid('');
    setTravelToCountry(travelToCountry);
    console.log(travelToCountry, 'travelToCountry');
  };
  const handleDateTravel = DatetravelTo => {
    setIsFormValid('');
    setDateTravelTo(DatetravelTo);
    console.log(DatetravelTo, 'DatetravelTo');
  };

  const handleCityTravel = travelCity => {
    setIsFormValid('');
    setTravelCity(travelCity);
    console.log(travelCity, 'travtravelCityel');
  };

  const [dates, setDates] = useState(new Date());
  const [Errdates, ErrSetdates] = useState('');

  // const onChange = (event, selectedDate) => {
  //   ErrSetdates("");
  //   setShowDatePicker(Platform.OS === "ios");
  //   if (selectedDate) {
  //     setDates(selectedDate);
  //     console.log(selectedDate, dates, "ggg");
  //   } else if (selectedDate === " ") {
  //     ErrSetdates("Select a Pickup Dater");
  //   }
  // };
  //console.log(dates, dates, "datesdates");
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleCityChange = city => {
    setSelectedCity(city);
    // Add any other logic you need when the city changes
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
        flexGrow: 1,
        paddingLeft: 16,
        paddingRight: 16,

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
          paddingTop: 24,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftSVG width={16} height={16} color="#515FDF" />
        </TouchableOpacity>
        <View>
          <View
            style={{
              backgroundColor: '#515FDF12',
              justifyContent: 'center',
              alignItems: 'center',
              width: 64,
              height: 64,
              borderRadius: 3333,
              marginTop: 48,
            }}>
            <Icon name="truck-fill" size={24} color="#515FDF" />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Plus Jakarta Sans SemiBold',
              marginTop: 12,
            }}>
            Deliver Someone's Parcel
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#66666695',
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
              color: '#666666',
            }}>
            Where are you traveling to?
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
            data={Country}
            //search

            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor={'#1e1e1e45'}
            placeholder="Select Country"
            value={travelToCountry}
            onChange={handleCountryChange}
          />

          {/* <TextInput
            style={[[styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}]]}
            value={travelTo}
            onChangeText={handleTravelToChange}
            placeholder="Within the country / Overseas"
          /> */}
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What State are you traveling to?
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
            data={nigeriaStates}
            //search
            maxHeight={500}
            labelField="label"
            valueField="value"
            placeholderTextColor={'#1e1e1e45'}
            placeholder="Select Nigerian State"
            value={travelTo}
            onChange={handleCountryStatesChange}
          />

          {/* <TextInput
            style={[[styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}]]}
            value={travelTo}
            onChangeText={handleTravelToChange}
            placeholder="Within the country / Overseas"
          /> */}
        </View>
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What City are you traveling to?
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
            placeholderTextColor="#1e1e1e45"
            placeholder="Select Nigerian City"
            value={selectedCity}
            onChange={handleCityChange}
          />
        </View>
        {/* <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontFamily: "Plus Jakarta Sans Regular", color:'#666666' }}>
            Which city are you traveling to?
          </Text>
          <TextInput
            style={[[styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}]]}
            onChangeText={handleCityTravel}
            placeholder="Enter city"
            value={selectedCity}
          />
        </View> */}

        {/* Travel Date */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What Time are you estimated to arrive? (in Hrs)
          </Text>
          <TextInput
            style={[
              [styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}],
            ]}
            value={DatetravelTo}
            onChangeText={handleDateTravel}
            placeholder="Enter time in hrs date"
            keyboardType="numeric"
          />
        </View>

        {/* Arrival Date */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What date will you travel?
          </Text>
          <View>
            <ThreeDropdowns
              onYearChange={handleYearChange}
              onMonthChange={handleMonthChange}
              onDayChange={handleDayChange}
            />
          </View>

          {/* <TextInput
            style={[[styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}]]}
            value={travelDate}
            onChangeText={(text) => setTravelDate(text)}
            placeholder="Enter estimated arrival time"
          /> */}
          <View
            style={[
              styles.input,
              {
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            {/* <View>
              <Text
                style={[
                  {
                    fontFamily: "Plus Jakarta Sans Medium",
                    //color: `${theme.text}65`,
                    fontSize: 16,
                  },
                ]}
              >{`${dates ? dates : "Choose date"}`}</Text>
            </View> */}
            {/* <View>
              <Button
                onPress={() => setShowDatePicker(true)}
                title="Choose Date"
              />
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dates}
                  //mode="datetime"
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  minimumDate={currentDate}
                  timeZoneOffsetInMinutes={-60}
                />
              )}
            </View> */}
          </View>
        </View>

        {/* Arrival Time */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What date will you arrive?
          </Text>

          <View>
            <ThreeDropdowns
              onYearChange={handleYearChangeArrival}
              onMonthChange={handleMonthChangeArrival}
              onDayChange={handleDayChangeArrival}
            />
          </View>
        </View>

        {/* Bus Stop */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            Where is your preferred bus stop?
          </Text>
          <TextInput
            style={[
              [styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}],
            ]}
            value={busStop}
            onChangeText={text => setBusStop(text)}
            placeholder="Enter preferred bus stop"
          />
          <Text
            style={{
              color: '#515FDF',
              padding: 16,
              backgroundColor: '#515FDF25',
              fontFamily: 'Plus Jakarta Sans Regular',
              borderLeftWidth: 2,
              borderLeftColor: '#515FDF',
            }}>
            Safety precaution: only deliver a parcel in a public place
          </Text>
        </View>

        {/* Travel From */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            Which city are you traveling from?
          </Text>
          <TextInput
            style={[
              [styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}],
            ]}
            value={travelFrom}
            onChangeText={text => setTravelFrom(text)}
            placeholder="Enter city"
          />
        </View>

        {/* Pickup Location */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What is your preferred pickup location?
          </Text>
          <TextInput
            style={[
              [styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}],
            ]}
            value={pickupLocation}
            onChangeText={text => setPickupLocation(text)}
            placeholder="Enter pickup location"
          />
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What is your Min Price or Charge?
          </Text>
          <TextInput
            style={[
              [styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}],
            ]}
            value={minprice}
            onChangeText={text => setMinprice(text)}
            placeholder="Enter pickup location"
            keyboardType="numeric"
          />
        </View>

        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What is your Max Price or Charge?
          </Text>
          <TextInput
            style={[
              [styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}],
            ]}
            value={maxprice}
            onChangeText={text => setMaxprice(text)}
            placeholder="Enter pickup location"
            keyboardType="numeric"
          />
        </View>
        {/* Pi
        ckup Time */}
        <View style={{marginTop: 24}}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#666666',
            }}>
            What is your preferred pickup time?
          </Text>
          <TextInput
            style={[
              [styles.textInput, {borderColor: '#66666665', borderWidth: 0.6}],
            ]}
            value={pickupTime}
            onChangeText={text => setPickupTime(text)}
            placeholder="Enter pickup time"
          />
          <Text
            style={{
              color: '#515FDF',
              padding: 16,
              backgroundColor: '#515FDF25',
              fontFamily: 'Plus Jakarta Sans Regular',
              borderLeftWidth: 2,
              borderLeftColor: '#515FDF',
            }}>
            Ensure you check any item you're delivering before sealing.
          </Text>
        </View>
        <View style={[styles.views, {marginTop: 48}]}>
          <Text
            style={{
              fontFamily: 'Plus Jakarta Sans Bold',
              color: '#000',
              fontSize: 13,
            }}>
            Which of these types of parcels can you deliver? Options are:
          </Text>
        </View>
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginTop: 24,
              }}
              onPress={() => handleParcelToggle('light')}
              disabled={lightParcelChecked}>
              <Icon
                name={
                  lightParcelChecked
                    ? 'checkbox-circle-fill'
                    : 'checkbox-circle-line'
                }
                size={18}
                color={lightParcelChecked ? '#515FDF' : '#121212'}
              />
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Plus Jakarta Sans Regular',
                  fontSize: 14,
                }}>
                Light parcels one can easily carry.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginTop: 24,
              }}
              onPress={() => handleParcelToggle('heavy')}
              disabled={heavyParcelChecked}>
              <Icon
                name={
                  heavyParcelChecked
                    ? 'checkbox-circle-fill'
                    : 'checkbox-circle-line'
                }
                size={18}
                color={heavyParcelChecked ? '#515FDF' : '#121212'}
              />
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Plus Jakarta Sans Regular',
                  fontSize: 14,
                }}>
                Heavy parcels that can fit into one's car boot.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginBottom: 200,
          }}>
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
            }}
            onPress={handleSubmit}
            // disabled={!isFormValid}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Plus Jakarta Sans Regular',
                color: '#666666',
                color: 'white',
              }}>
              Next
            </Text>
          </TouchableOpacity>

          {isFormValid && (
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
                {isFormValid ? 'Complete All Forms to Proceed' : null}
              </Text>
            </View>
          )}
        </View>

        <View>
          {/* <TouchableOpacity
            style={{
              color: "#515FDF",
              padding: 16,
              backgroundColor: "#515FDF",
              fontFamily: "Plus Jakarta Sans Regular",
              borderRadius: 6,
              marginTop: 48,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 200,
            }}
            onPress={handleEllipsisPress}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Plus Jakarta Sans SemiBold",
                color: "white",
              }}
            >
              Next
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContainerView}>
            <Text
              style={[
                styles.ellipsis,
                {
                  textAlign: 'right',
                  fontSize: 16,
                  fontFamily: 'Plus Jakarta Sans Regular',
                  color: 'black',
                },
              ]}
              onPress={closeModal}>
              Close
            </Text>
            <View style={styles.views}>
              <Text
                style={{
                  fontFamily: 'Plus Jakarta Sans Bold',
                  color: '#000',
                  fontSize: 18,
                }}>
                Which of these types of parcels can you deliver? Options are:
              </Text>
            </View>
            <View style={styles.container}>
              <View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 24,
                  }}
                  onPress={() => handleParcelToggle('light')}
                  disabled={lightParcelChecked}>
                  <Icon
                    name={
                      lightParcelChecked
                        ? 'checkbox-circle-fill'
                        : 'checkbox-circle-line'
                    }
                    size={24}
                    color="#000"
                  />
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Plus Jakarta Sans Regular',
                      fontSize: 16,
                    }}>
                    Light parcels I can easily carry.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 24,
                  }}
                  onPress={() => handleParcelToggle('heavy')}
                  disabled={heavyParcelChecked}>
                  <Icon
                    name={
                      heavyParcelChecked
                        ? 'checkbox-circle-fill'
                        : 'checkbox-circle-line'
                    }
                    size={24}
                    color="#000"
                  />
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Plus Jakarta Sans Regular',
                      fontSize: 16,
                    }}>
                    Heavy parcels that can fit into my car boot.
                  </Text>
                </TouchableOpacity>
              </View>
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
              }}
              onPress={handleSubmit}
              // disabled={!isFormValid}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Plus Jakarta Sans SemiBold',
                  color: 'white',
                }}>
                Next
              </Text>
            </TouchableOpacity>

            {isFormValid && (
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
                  {isFormValid ? 'Complete All Forms to Proceed' : null}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateDelivery;
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
  },
  dropdown: {
    height: 55,
    // borderColor: `${theme.text}65`,
    //  borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 4,
    // color: gray
    backgroundColor: '#f9f9f9',
  },
  checkbox: {},
});

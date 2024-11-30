import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-remix-icon';
import HistoryLogs from '../Components/HistoryLog';
import {useNavigation} from '@react-navigation/native';
const imageBackground = require('../../assets/Images/Dashboard.png');
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchParcelSenders,
  fetchUserDeliveryHistory,
  fetchUserSendParcelHistory,
  ///fetchUserSendParcelHistory,
} from '../../Redux/Deliveries/Deliveries';
import {fetchUserProfile} from '../../Redux/Users/User';
import {Linking} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {fetchSingleUserParcelHistory} from '../../Redux/Deliveries/Parcels';
import deliverParcelSlice, {
  fetchUserParcels,
} from '../../Redux/Auth/deliverParcelSlice';
import {
  deleteParcelforUser,
  fetchParcelsByUserId,
} from '../../Redux/Auth/sendParcelSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserById} from '../../Redux/Auth/Auth';

const Deliver = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('flipper'); // "flipper" is active by default
  const {isLoading, deliveries} = useSelector(state => state.delivery);
  // const {userProfile} = useSelector(state => state.user);
  const [delivery, setDeliveries] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isModalVisibles, setModalVisibles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDeliverys, setSelectedDeliverys] = useState(null);
  const [userData, setUsersData] = useState('');
  const [parcels, setParcels] = useState([]);

  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          const storedAccessToken = await AsyncStorage.getItem('access_token');
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);

          dispatch(fetchUserById(storedUserId))
            .then(response => {
              setUserProfile(response?.payload);
              console.log(
                response?.payload?.is_driver,
                'esponse?.payload?.is_driver ',
              );
              if (response?.payload?.is_driver === false) {
                setActiveTab('ripper');
              }
            })
            .catch(error => {
              console.log('Error fetching user profile:', error);
            });
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };

      getUserData();
    }, []),
  );

  //console.log(selectedDeliverys, 'selectedDeliverys');
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading to true when the screen gains focus
      fetchData();
      fetchParcels();
    }, [fetchData, fetchParcels]),
  );

  const openModal = deliveryData => {
    setSelectedDelivery(deliveryData);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModals = deliveryData => {
    setSelectedDeliverys(deliveryData);
    setModalVisibles(true);
  };

  const closeModals = () => {
    setModalVisibles(false);
  };

  useEffect(() => {
    if (isLoading === true) {
      dispatch(fetchAllPosts())
        .then(response => {})
        .catch(error => {});
      dispatch(fetchUserProfile())
        .then(response => {
          setUsersData(response?.payload);
          // //console.log(response, "response");
        })
        .catch(error => {});
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserProfile())
      .then(response => {
        setUsersData(response?.payload);
        ////console.log(response, "response");
      })
      .catch(error => {});
  }, [dispatch]);

  const fetchData = () => {
    dispatch(fetchUserParcels())
      .then(response => {
        //console.log(response?.payload, 'has_verified_bvn?.payload');
        setDeliveries(response?.payload);
      })
      .catch(error => {});
  };

  // //console.log(userData?.has_verified_bvn, "userData");

  const fetchParcels = () => {
    dispatch(fetchParcelsByUserId())
      .then(response => {
        //console.log('Data fetched setParcels', response?.payload);
        setParcels(response?.payload?.data);
        //console.log(response, 'parcelsresponse.data;');
      })
      .catch(error => {
        ////console.log("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchParcels();

    if (loading) {
      fetchData();
      fetchParcels();
      //console.log('3');
      setLoading(false);
    }
  }, []);

  const toggleFlipper = () => {
    fetchData();
    fetchParcels();
    setActiveTab('flipper');
    //console.log('4');
  };

  const toggleRipper = () => {
    fetchData();
    fetchParcels();
    //console.log('4');
    setActiveTab('ripper');
  };

  //console.log(parcels, 'parcels?.Send_parcel_history');

  const handleNext = () => {
    if (userProfile?.driver === true) {
      navigation.navigate('CreateDelivery');
    } else {
      navigation.navigate('BecomeADriver');
      // navigation.navigate('CreateWallet');
    }
  };

  const handleNextParcel = () => {
    if (userData?.has_verified_bvn) {
      navigation.navigate('CreateParcel');
    } else {
      navigation.navigate('CreateParcel');
      //navigation.navigate('CreateParcel');
      // navigation.navigate('CreateWallet');
    }
  };

  // //console.log(delivery, "delivery");
  //console.log(selectedDeliverys, 'selectedDeliverys');
  //          onPress={() => navigation.navigate('BecomeADriver')}
  //console.log(JSON.stringify(selectedDeliverys, null, 2));
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#f4f4f4',
        flex: 1,
        flexGrow: 1,
        paddingBottom: 24,
        height: '100%',
        marginBottom: -96,
        width: '100%',
      }}>
      <ScrollView
        style={{
          padding: 16,
          width: '100%',
        }}>
        <View style={styles.container}>
          <Image
            style={{
              width: '100%',
              height: 260,
              borderRadius: 12,
            }}
            source={imageBackground}
          />
          <View style={styles.overlay}>
            <Text style={styles.name}>
              👋 {''}Hello, {userProfile.first_name} {userProfile.last_name}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                marginBottom: 12,
                gap: 8,
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: '#FFFFFF25',
                    borderRadius: 2222,
                    height: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 24,
                    paddingRight: 24,
                    flexDirection: 'row',
                    gap: 12,
                  },
                ]}
                onPress={handleNext}>
                <Icon name="truck-fill" size={20} color="#fff" />
                <Text style={styles.buttonText}>Deliver Someone's Parcel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#FFFFFF25',
                  borderRadius: 2222,
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 24,
                  paddingRight: 24,
                  flexDirection: 'row',
                  gap: 12,
                }}
                onPress={handleNextParcel}>
                <Icon name="truck-fill" size={20} color="#fff" />
                <Text style={styles.buttonText}>Send a Parcel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            backgroundColor: 'white',
            marginTop: 12,
            alignItems: 'center',
            padding: 8,
            borderRadius: 2444,
          }}>
          {userProfile?.is_driver === true && (
            <TouchableOpacity
              style={{
                backgroundColor:
                  activeTab === 'flipper' ? '#515FDF' : 'transparent',
                borderRadius: 24,
                alignSelf: 'center',
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 24,
              }}
              onPress={toggleFlipper}>
              <Text
                style={{
                  color: activeTab === 'flipper' ? 'white' : 'black',
                  fontFamily:
                    activeTab === 'flipper'
                      ? 'Plus Jakarta Sans Bold'
                      : 'Plus Jakarta Sans Regular',
                  fontSize: 13,
                }}>
                Deliver a Parcel
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{
              backgroundColor:
                activeTab === 'ripper' ? '#515FDF' : 'transparent',
              borderRadius: 24,
              alignSelf: 'center',
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 24,
            }}
            onPress={toggleRipper}>
            <Text
              style={{
                color: activeTab === 'ripper' ? 'white' : 'black',
                fontFamily:
                  activeTab === 'ripper'
                    ? 'Plus Jakarta Sans Bold'
                    : 'Plus Jakarta Sans Regular',
                fontSize: 13,
              }}>
              Send Parcel
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={closeModal} style={{}}>
                <Text style={[styles.closeButtonText, {color: '#000'}]}>
                  Close
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginTop: 24,
                  marginBottom: 24,
                }}>
                <View
                  style={{
                    backgroundColor: '#515FDF12',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 3333,
                  }}>
                  <Icon name="truck-fill" size={20} color="#515fdf" />
                </View>
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 24,
                  fontSize: 18,
                  fontFamily: 'Plus Jakarta Sans Bold',
                }}>
                Delivery Details
              </Text>

              <View style={styles.flexContainers}>
                <Text
                  style={styles.flexFontsSmall}>{`Destination State:`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.destination}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Destination City:`}</Text>
                <Text
                  style={styles.flexFonts}>{`${selectedDelivery?.city}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Bus stop:`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.bus_stop}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Arrival date:`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.arrival_date}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`${
                  selectedDelivery?.can_carry_light === true
                    ? 'Can Carry Light Weight'
                    : 'Can Carry Heavy Weight'
                }`}</Text>
                <Text style={styles.flexFonts}>{`${
                  selectedDelivery?.can_carry_light === true ? 'Yes' : 'Yes'
                }`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`${
                  selectedDelivery?.can_carry_light === true
                    ? 'Can Carry Light Weight'
                    : 'Can Carry Heavy Weight'
                }`}</Text>
                <Text style={styles.flexFonts}>{`${
                  selectedDelivery?.can_carry_light === true ? 'Yes' : 'Yes'
                }`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`${
                  selectedDelivery?.can_carry_light === true
                    ? 'Can Carry Light Weight'
                    : 'Can Carry Heavy Weight'
                }`}</Text>
                <Text style={styles.flexFonts}>{`${
                  selectedDelivery?.can_carry_light === true ? 'Yes' : 'Yes'
                }`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`${
                  selectedDelivery?.min_price === true
                    ? 'Min Price'
                    : 'Max Price'
                }`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.min_price}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`${
                  selectedDelivery?.max_price === true
                    ? 'Max Price'
                    : 'Min Price'
                }`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.max_price}`}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);

                  navigation.navigate('PassengerLists', {
                    chatID: selectedDelivery?._id,
                    type: 'delivery',
                  });
                }}
                style={[styles.buttons, {marginBottom: -32}]}>
                <Text style={styles.closeButtonText}>Open Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!selectedDelivery?._id) {
                    return Alert.alert(
                      'Error',
                      'No delivery selected to delete.',
                    );
                  }

                  // Dispatch the deleteParcel action
                  dispatch(deleteParcel(selectedDelivery._id))
                    .then(result => {
                      const message =
                        result.meta.requestStatus === 'fulfilled'
                          ? 'Parcel deleted successfully.'
                          : result.payload || 'Failed to delete parcel.';

                      const title =
                        result.meta.requestStatus === 'fulfilled'
                          ? 'Success'
                          : 'Error';

                      Alert.alert(title, message);

                      if (result.meta.requestStatus === 'fulfilled') {
                        fetchData();
                        setModalVisible(false);
                      }
                    })
                    .catch(() => {
                      Alert.alert('Error', 'An unexpected error occurred.');
                    });
                }}
                style={[styles.buttons, {backgroundColor: '#515FDF21'}]}>
                <Text style={[styles.closeButtonText, {color: '#515FDF'}]}>
                  Delete this Request
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisibles}
          onRequestClose={closeModals}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Display delivery details here */}

              <TouchableOpacity onPress={closeModals} style={{}}>
                <Text style={[styles.closeButtonText, {color: '#000'}]}>
                  Close
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginTop: 24,
                  marginBottom: 24,
                }}>
                <View
                  style={{
                    backgroundColor: '#515FDF12',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 3333,
                  }}>
                  <Icon name="truck-fill" size={20} color="#515fdf" />
                </View>
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 24,
                  fontSize: 18,
                  fontFamily: 'Plus Jakarta Sans Bold',
                }}>
                Parcel Details
              </Text>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Senders City`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.sender_city}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Senders ID`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.send_parcel_id}`}</Text>
              </View>
              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Senders State`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.state}`}</Text>
              </View>
              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Delivery date`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.delivery_date}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Is Fragile`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.is_fragile}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Is Perishable`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.is_perishable}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Receiver's City`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.receiver_city}`}</Text>
              </View>
              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{` Receiver Email`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.receiver_email}`}</Text>
              </View>
              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{` Receiver Name`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.receiver_name}`}</Text>
              </View>
              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{` Receiver Gender`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.receiver_gender}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text
                  style={styles.flexFontsSmall}
                  onPress={() =>
                    Linking.openURL(`tel:${selectedDeliverys?.receiver_phone}`)
                  }>{` Receiver Phone`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.receiver_phone}`}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setModalVisibles(false);
                  navigation.navigate('SendersList', {
                    passID: selectedDeliverys?._id,
                    type: 'delivery',
                  });
                }}
                style={[styles.buttons, {marginBottom: -32}]}>
                <Text style={styles.closeButtonText}>Find a Driver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (!selectedDeliverys?._id) {
                    return Alert.alert(
                      'Error',
                      'No delivery selected to delete.',
                    );
                  }

                  // Dispatch the deleteParcel action
                  dispatch(deleteParcelforUser(selectedDeliverys._id))
                    .then(result => {
                      const message =
                        result.meta.requestStatus === 'fulfilled'
                          ? 'Parcel deleted successfully.'
                          : result.payload || 'Failed to delete parcel.';

                      const title =
                        result.meta.requestStatus === 'fulfilled'
                          ? 'Success'
                          : 'Error';

                      Alert.alert(title, message);

                      if (result.meta.requestStatus === 'fulfilled') {
                        fetchParcels();
                        setModalVisibles(false);
                      }
                    })
                    .catch(() => {
                      Alert.alert('Error', 'An unexpected error occurred.');
                    });
                }}
                style={[styles.buttons, {backgroundColor: '#515FDF21'}]}>
                <Text style={[styles.closeButtonText, {color: '#515FDF'}]}>
                  Delete this Request
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {activeTab === 'flipper' && userProfile?.is_driver === true && (
          <View
            style={{
              marginBottom: 180,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                gap: 4,
                justifyContent: 'space-between',
              }}>
              {/* <View
                style={{
                  backgroundColor: '#ffffff',
                  padding: 16,
                  borderRadius: 12,

                      fontSize: 13,
                      color: '#666',
                      fontFamily: 'Plus Jakarta Sans Regular',
                    }}>
                    Pending Deliveries
                  </Text>
                </View>
              </View> */}
              <View
                style={{
                  backgroundColor: '#ffffff',
                  padding: 16,
                  borderRadius: 12,
                  height: 180,
                  paddingBottom: 24,
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: 12,
                }}>
                <View
                  style={{
                    backgroundColor: '#515FDF12',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 30,
                    height: 30,
                    borderRadius: 3333,
                  }}>
                  <Icon name="truck-fill" size={16} color="#515fdf" />
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'Plus Jakarta Sans Bold',
                  }}>
                  {delivery?.length || 0}
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#666',
                      fontFamily: 'Plus Jakarta Sans Regular',
                    }}>
                    Pending Deliveries
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  //backgroundColor: "white",
                  borderRadius: 12,
                  //padding: 16,
                  gap: 2,
                  marginTop: 48,
                  marginBottom: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Plus Jakarta Sans Bold',
                  }}>
                  Delivery History
                </Text>
              </View>
              <View
                style={{
                  gap: 8,
                }}>
                {delivery?.delivery_history?.length === 0 ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      margin: 64,
                      fontFamily: 'Plus Jakarta Sans Regular',
                      fontSize: 13,
                      color: '#666',
                    }}>
                    No deliveries available
                  </Text>
                ) : null}

                {Array.isArray(delivery) &&
                  delivery
                    ?.slice()
                    ?.reverse()
                    ?.map((data, index) => (
                      <View key={index}>
                        <TouchableOpacity onPress={() => openModal(data)}>
                          <HistoryLogs
                            receiversName={`Destination: ${data?.destination}`}
                            location={
                              data?.can_carry_light
                                ? 'Can carry light weight'
                                : 'Can carry heavy weight'
                            }
                            price={`NGN${data.max_price}`}
                            icon="paper-plane"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'ripper' && (
          <View
            style={{
              marginBottom: 180,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                gap: 4,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  padding: 16,
                  borderRadius: 12,
                  height: 180,
                  paddingBottom: 24,
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: 12,
                }}>
                <View
                  style={{
                    backgroundColor: '#515FDF12',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30,
                    width: 30,
                    borderRadius: 3333,
                  }}>
                  <Icon name="truck-fill" size={20} color="#515fdf" />
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: 'Plus Jakarta Sans Bold',
                  }}>
                  {parcels?.length || 0}
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#666',
                      fontFamily: 'Plus Jakarta Sans Regular',
                    }}>
                    Pending Parcels
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  //backgroundColor: "white",
                  borderRadius: 12,
                  //padding: 16,
                  gap: 2,
                  marginTop: 48,
                  marginBottom: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Plus Jakarta Sans Bold',
                  }}>
                  Parcel History
                </Text>
                {/* <FontAwesome5
                  name="arrow-alt-circle-down"
                  size={24}
                  color="#515FDF"
                /> */}

                {/* <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Plus Jakarta Sans Regular",
                    color: "gray",
                  }}
                >
                  View your Parcel History
                </Text> */}
              </View>

              <View
                style={{
                  gap: 8,
                }}>
                {
                  // parcels?.Send_parcel_history?.length === 0 ? (
                  parcels?.length === 0 ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        margin: 64,
                        fontFamily: 'Plus Jakarta Sans Regular',
                        fontSize: 13,
                        color: '#666',
                        textAlign: 'center',
                        margin: 64,
                        fontFamily: 'Plus Jakarta Sans Regular',
                      }}>
                      No Send Parcels Requests available
                    </Text>
                  ) : (
                    //Array.isArray(parcels?.Send_parcel_history) &&
                    // parcels?.Send_parcel_history?.map((data, index) => (

                    Array.isArray(parcels) &&
                    parcels
                      ?.slice()
                      ?.reverse()
                      ?.map((data, index) => (
                        <View key={index}>
                          <TouchableOpacity onPress={() => openModals(data)}>
                            <HistoryLogs
                              receiversName={`${data?.receiver_name}`}
                              location={`${data?.receiver_email}`}
                              price={
                                new Date(data?.delivery_date)
                                  .toISOString()
                                  .split('T')[0]
                              } // Format delivery_date
                              icon="paper-plane"
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                  )
                }
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Deliver;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    gap: 12,
  },
  name: {
    marginTop: 24,
    color: 'white',
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Bold',
  },
  button: {},
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000075',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    height: 'auto',
  },
  flexContainers: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flexFonts: {
    fontSize: 12,
    fontFamily: 'Plus Jakarta Sans Bold',
  },
  flexFontsSmall: {
    fontSize: 12,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#666',
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Plus Jakarta Sans Bold',
  },
  buttons: {
    width: '100%',
    height: 45,
    backgroundColor: '#515FDF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 48,
    marginBottom: 48,
  },
});

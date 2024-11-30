import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  ViewBase,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HistoryLogs from '../Components/HistoryLog';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
//import {fetchPassengerRequests} from '../../Redux/Ride/Ride';
const imageBackground = require('../../assets/Images/Dashboard.png');
import Icon from 'react-native-remix-icon';
import {fetchUserProfile} from '../../Redux/Users/User';
import {deleteDriver, fetchDriversByUserId} from '../../Redux/Auth/driverSlice';
import {
  deletePassengerRequest,
  fetchPassengerRequests,
} from '../../Redux/Auth/passengerSlice';
import FloatingSupportButton from '../Support/FloatingButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserById} from '../../Redux/Auth/Auth';

const Deliver = () => {
  const {isLoading, deliveries} = useSelector(state => state.delivery);
  const [userData, setUsersData] = useState('');
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibles, setModalVisibles] = useState(false);
  const dispatch = useDispatch();
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeTab, setActiveTab] = useState('flipper'); // "flipper" is active by default
  const [delivery, setDeliveries] = useState([]);
  const [rider, setRider] = useState([]);
  const [selectedDeliverys, setSelectedDeliverys] = useState(null);
  const openModals = deliveryData => {
    setSelectedDeliverys(deliveryData);
    setModalVisibles(true);
    // fetchData();
    // fetchParcels();
  };

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

  const closeModals = () => {
    setModalVisibles(false);
    // fetchData();
    // fetchParcels();
  };
  const openModal = deliveryData => {
    setSelectedDelivery(deliveryData);
    setModalVisible(true);
    // fetchData();
    // fetchParcels();
  };

  const closeModal = () => {
    setModalVisible(false);
    // fetchData();
    // fetchParcels();
  };

  const toggleFlipper = () => {
    setActiveTab('flipper');
  };

  const toggleRipper = () => {
    setActiveTab('ripper');
  };

  // const toggleFlipper = () => {
  //   setFlipperActive(!flipperActive);
  //   setRipperActive(false);
  // };
  // const toggleRipper = () => {
  //   setRipperActive(!ripperActive);
  //   setFlipperActive(false);
  // };
  const fetchData = () => {
    dispatch(fetchPassengerRequests())
      .then(response => {
        setDeliveries(response?.payload);
      })
      .catch(error => {});
  };
  // const fetchParcels = () => {
  //   dispatch(fetchDriversByUserId())
  //     .then(response => {
  //       if (Array.isArray(response?.payload)) {
  //         setRider(response?.payload.data);
  //       } else {
  //         setRider([]); // or handle this case as appropriate
  //       }
  //     })

  //     .catch(error => {
  //       //console.log(error);
  //     });
  // };

  // Fetch the history data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        try {
          // Fetch passenger history
          const passengerResponse = await dispatch(fetchPassengerRequests());
          if (Array.isArray(passengerResponse?.payload)) {
            setDeliveries(passengerResponse.payload);
          } else {
            setDeliveries([]); // Set empty array if not an array
          }

          // Fetch driver history
          const driverResponse = await dispatch(fetchDriversByUserId());

          console.log(
            driverResponse.payload?.driving_history,
            'response?.payloadresponse?.payload',
          );
          setRider(driverResponse.payload?.data);
          if (Array.isArray(driverResponse?.payload)) {
            setRider(driverResponse.payload);
          } else {
            // setRider([]); // Set empty array if not an array
          }
        } catch (error) {
          console.error('Error fetching history:', error);
          setDeliveries([]); // Handle error case
          setRider([]); // Handle error case
        }
      };

      fetchHistory();
    }, [dispatch]),
  );

  console.log(rider, 'riderrr');
  useFocusEffect(
    useCallback(() => {
      // Fetch passenger and driver history

      // Fetch all posts and user profile if loading
      if (isLoading) {
        const fetchPostsAndProfile = async () => {
          try {
            await dispatch(fetchAllPosts());
            const userProfileResponse = await dispatch(fetchUserProfile());
            setUsersData(userProfileResponse?.payload);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching posts or user profile:', error);
          }
        };

        fetchPostsAndProfile();
      }

      // Cleanup function to be called on screen blur (optional)
      return () => {
        // Cleanup logic if necessary
      };
    }, [dispatch, isLoading]),
  );

  useEffect(() => {
    dispatch(fetchPassengerRequests())
      .then(response => {
        console.log(response?.payload, 'posts');
        setDeliveries(response?.payload);
      })
      .catch(error => {
        //console.log(error);
      });
    dispatch(fetchDriversByUserId())
      .then(response => {
        console.log(
          response.payload?.driving_history,
          'response?.payloadresponse?.payload',
        );
        setRider(response.payload?.data);
      })

      .catch(error => {
        //console.log(error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (isLoading === true) {
      dispatch(fetchAllPosts())
        .then(response => {})
        .catch(error => {});
      dispatch(fetchUserProfile())
        .then(response => {
          setUsersData(response?.payload);
          // console.log(response, "response");
        })
        .catch(error => {});
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserProfile())
      .then(response => {
        setUsersData(response?.payload);
        //console.log(response, "response");
      })
      .catch(error => {});
  }, [dispatch]);

  console.log(delivery, 'deliverydelivery');
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
        <FloatingSupportButton />
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
              👋 {''}Hello, {''}
              {userProfile.first_name}
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
                onPress={() => {
                  if (userProfile?.driver === true) {
                    navigation.navigate('passengers');
                  } else {
                    navigation.navigate('BecomeADriver');
                    // navigation.navigate('CreateWallet');
                  }
                }}>
                <Icon name="car-fill" size={14} color="#FFF" />
                <Text style={styles.buttonText}>Carry a Passenger</Text>
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
                onPress={() => {
                  if (userData?.has_verified_bvn) {
                    navigation.navigate('CreateRide');
                  } else {
                    //navigation.navigate('CreateParcel');
                    navigation.navigate('CreateRide');
                  }
                  //navigation.navigate('CreateRide');
                }}>
                <Icon name="car-fill" size={14} color="#FFF" />

                <Text style={styles.buttonText}>Join a Ride</Text>
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
                Driver Requests
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
              Passenger Requests{' '}
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'flipper' && (
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
                    width: 32,
                    height: 32,
                    borderRadius: 3333,
                  }}>
                  <Icon name="car-fill" size={16} color="#515fdf" />
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'Plus Jakarta Sans Bold',
                  }}>
                  {rider?.length || 0}
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Plus Jakarta Sans Regular',
                      color: '#666',
                    }}>
                    Total Ride Requests
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
                  Passengers History
                </Text>
              </View>
              <View
                style={{
                  gap: 8,
                }}>
                {rider?.length === 0 ? (
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
                ) : (
                  rider
                    ?.slice()
                    ?.reverse()
                    ?.map((data, index) => (
                      <View key={index}>
                        <TouchableOpacity onPress={() => openModal(data)}>
                          <HistoryLogs
                            receiversName={`${data?.current_city} to ${data?.destination}`}
                            location={`${data?.travelling_date}`}
                            // price={
                            //   new Date(data?.delivery_date)
                            //     .toISOString()
                            //     .split("T")[0]
                            // } // Format delivery_date
                            icon="paper-plane"
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                )}
              </View>
            </View>
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Display delivery details here */}
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
                  <Icon name="car-fill" size={16} color="#515fdf" />
                </View>
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 24,
                  fontSize: 18,
                  fontFamily: 'Plus Jakarta Sans Bold',
                }}>
                Driver Request Details
              </Text>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Curent City:`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.current_city}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Destination:`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.destination}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Drop Off`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.drop_off}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text
                  style={styles.flexFontsSmall}>{`Number of Passenger`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.no_of_passengers}`}</Text>
              </View>
              <View style={styles.flexContainers}>
                <Text
                  style={styles.flexFontsSmall}>{`Preferred Take off`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.preferred_take_off}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Time of Take off`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.time_of_take_off}`}</Text>
              </View>
              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Travelling Date`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDelivery?.travelling_date}`}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  closeModal();

                  navigation.navigate('PassengerLists', {
                    chatID: selectedDelivery?._id,
                    type: 'ride',
                  });
                }}
                style={[styles.buttons, {marginBottom: -32}]}>
                <Text style={styles.closeButtonText}>Open Messages</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (selectedDelivery?._id) {
                    // Dispatch the deleteParcel action
                    dispatch(deleteDriver(selectedDelivery._id))
                      .then(result => {
                        if (result.meta.requestStatus === 'fulfilled') {
                          console.log(
                            'Parcel deleted successfully:',
                            result.payload,
                          );
                          dispatch(fetchDriversByUserId())
                            .then(response => {
                              console.log(
                                response.payload?.driving_history,
                                'response?.payloadresponse?.payload',
                              );
                              setRider(response.payload?.data);
                            })

                            .catch(error => {
                              //console.log(error);
                            });
                          Alert.alert(
                            'Success',
                            'Parcel deleted successfully.',
                          );

                          setModalVisible(false);
                        } else {
                          console.error(
                            'Error deleting parcel:',
                            result.payload,
                          );
                          Alert.alert(
                            'Error',
                            result.payload || 'Failed to delete parcel.',
                          );
                        }
                      })
                      .catch(error => {
                        console.error('Unexpected error:', error);
                        Alert.alert('Error', 'An unexpected error occurred.');
                      });
                  } else {
                    console.log('No delivery selected to delete.');
                    Alert.alert('Error', 'No delivery selected to delete.');
                  }
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
                  <Icon name="car-fill" size={16} color="#515fdf" />
                </View>
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 24,
                  fontSize: 18,
                  fontFamily: 'Plus Jakarta Sans Bold',
                }}>
                Join a Ride Request
              </Text>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Current City`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.current_city}`}</Text>
              </View>

              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Destination`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.destination}`}</Text>
              </View>
              <View style={styles.flexContainers}>
                <Text style={styles.flexFontsSmall}>{`Travel date`}</Text>
                <Text
                  style={
                    styles.flexFonts
                  }>{`${selectedDeliverys?.travelling_date} ${selectedDeliverys?.paid}`}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  console.log(selectedDeliverys?._id, 'selectedDeliverys?._id');
                  setModalVisibles(false);

                  if (selectedDeliverys?.paid) {
                    const newChatID = `${selectedDeliverys?.driver}${selectedDeliverys?._id}`; // Concatenate values

                    navigation.navigate('ChatComponent', {
                      passID: selectedDeliverys?._id,
                      type: 'ride',
                      chatID: newChatID,
                      requestID: selectedDeliverys?._id,
                      passenger: true,
                      UserName: `${selectedDeliverys?.driver_first_name} ${selectedDeliverys?.driver_last_name}`, // Concatenate first and last names
                    });
                  } else {
                    navigation.navigate('SendersList', {
                      passID: selectedDeliverys?._id,
                      type: 'ride',
                    });
                  }
                }}
                style={[styles.buttons, {marginBottom: 24}]}>
                <Text style={styles.closeButtonText}>Find a Driver</Text>
              </TouchableOpacity>

              {selectedDeliverys?.paid === false && (
                <TouchableOpacity
                  onPress={() => {
                    if (selectedDeliverys?._id) {
                      // Dispatch the deleteParcel action
                      dispatch(deletePassengerRequest(selectedDeliverys._id))
                        .then(result => {
                          if (result.meta.requestStatus === 'fulfilled') {
                            console.log(
                              'Parcel deleted successfully:',
                              result.payload,
                            );
                            dispatch(fetchPassengerRequests())
                              .then(response => {
                                console.log(
                                  response.payload?.driving_history,
                                  'response?.payloadresponse?.payload',
                                );
                                setDeliveries(response.payload);
                              })

                              .catch(error => {
                                //console.log(error);
                              });
                            Alert.alert(
                              'Success',
                              'Parcel deleted successfully.',
                            );

                            setModalVisibles(false);
                          } else {
                            console.error(
                              'Error deleting parcel:',
                              result.payload,
                            );
                            Alert.alert(
                              'Error',
                              result.payload || 'Failed to delete parcel.',
                            );
                          }
                        })
                        .catch(error => {
                          console.error('Unexpected error:', error);
                          Alert.alert('Error', 'An unexpected error occurred.');
                        });
                    } else {
                      console.log('No delivery selected to delete.');
                      Alert.alert('Error', 'No delivery selected to delete.');
                    }
                  }}
                  style={[
                    styles.buttons,
                    {backgroundColor: '#515FDF21', marginTop: -12},
                  ]}>
                  <Text style={[styles.closeButtonText, {color: '#515FDF'}]}>
                    Delete this Request
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
        {activeTab === 'ripper' && (
          <View
            style={{
              marginBottom: 180,
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
                  width: 32,
                  height: 32,
                  borderRadius: 3333,
                }}>
                <Icon name="car-fill" size={16} color="#515fdf" />
              </View>
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: 'Plus Jakarta Sans Bold',
                }}>
                {delivery?.length}
              </Text>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Plus Jakarta Sans Regular',
                    color: '#666',
                  }}>
                  Total Driver Requests
                </Text>
              </View>
            </View>

            <View>
              <View
                style={{
                  borderRadius: 12,
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
                  Ride History
                </Text>
              </View>

              <View
                style={{
                  gap: 8,
                }}>
                {delivery?.length === 0 ? (
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
                ) : Array.isArray(delivery) && delivery.length > 0 ? (
                  delivery
                    ?.slice()
                    ?.reverse()
                    ?.map((data, index) => (
                      <View key={index}>
                        <TouchableOpacity onPress={() => openModals(data)}>
                          <HistoryLogs
                            receiversName={`${data?.current_city} to ${data?.destination}`}
                            location={`${data?.travelling_date}`}
                            icon="paper-plane"
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                ) : (
                  <Text>No delivery data available</Text>
                )}
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
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Plus Jakarta Sans Medium',
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

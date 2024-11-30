import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Button,
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios'; // Import axios
import {NEW_BASE_URL} from '../../Redux/NewBaseurl/NewBaseurl';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserById} from '../../Redux/Auth/Auth';
import SetPriceModal from './SetPriceModal';
const SOCKET_SERVER_URL = NEW_BASE_URL;
const API_BASE_URL = `${NEW_BASE_URL}/api/chat`; // Assuming your API base URL
import {WebView} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import {paymentUrlCheckout} from '../../Redux/Users/User';
import {Paystack, paystackProps} from 'react-native-paystack-webview';
import StatusModal from './StatusModal';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const {chatID, UserName, type, driverID, requestID, item, passenger} =
    route.params;
  const fetchID = item?._id;
  console.log(type, 'chatIDchatIDchatID');
  // const concatenatedString = `${chatID}${item}${UserName}`;

  console.log(chatID, UserName, type, driverID, requestID, item, 'newChatID');
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
  const [price, setPriceDriver] = useState(null);
  const [userProfileDriver, setUserProfileDriver] = useState([]);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false); // Make the modal visible by default
  const [webViewVisible, setWebViewVisible] = useState(false); // WebView modal visibility state
  const [paymentUrl, setPaymentUrl] = useState(' '); // WebView modal visibility state
  const [userProfile, setUserProfile] = useState('');
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState([]);

  const [reloadKey, setReloadKey] = useState(0); // Track reloads

  const fetchChatDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${chatID}`);
      setPriceDriver(response?.data?.price);
      setAccessToken(response.data);
      console.log(response.data, 'response.setPriceDriver.data');
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };
  const handlePriceSet = () => {
    // Trigger a reload by updating the reloadKey
    setReloadKey(prevKey => prevKey + 1);
    fetchChatDetails();
  };

  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          const storedAccessToken = await AsyncStorage.getItem('access_token');
          setUserId(storedUserId);
          dispatch(fetchUserById(storedUserId))
            .then(response => {
              console.log('dispatcheddispatched', response?.payload);
              setUserProfile(response?.payload);
            })
            .catch(error => {
              //  console.log(error);
            });
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };

      getUserData();
    }, []),
  );

  const userID = userId; // Replace with current user's ID

  console.log(chatID, userID, UserName, 'djjdjd');
  const flatListRef = useRef(); // Create a ref for the FlatList

  useEffect(() => {
    // Fetch chat details and messages from the API
    const fetchChatDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${chatID}`);
        const chatData = response.data;
        setPriceDriver(response?.data?.price);
        setAccessToken(response.data);

        console.log(response.data, 'response.setPriceDriver.data');
        console.log(response.data, 'response.dataresponse.data');
        if (chatData.messages) {
          setMessages(chatData.messages); // Set the fetched messages
        }
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    };

    fetchChatDetails();

    socketRef.current = io(SOCKET_SERVER_URL);

    // Automatically join the room when the component is mounted
    socketRef.current.emit('joinRoom', chatID);
    socketRef.current.on('receiveMessage', newMessage => {
      console.log(newMessage, 'newMessagenewMessagenewMessage');

      // Add new message to state (without formatting the timestamp)
      setMessages(prevMessages => [...prevMessages, {...newMessage}]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [chatID]);

  useEffect(() => {
    // Scroll to the last message when messages are updated
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = passenger
      ? {
          chatID,
          message,
          userID,
          fetchID: driverID,
          passID: requestID,
          type,
          passenger,
          user_first_name: userProfile?.first_name,
          user_last_name: userProfile?.last_name,
        }
      : {chatID, message, userID, fetchID};

    console.log(payload, 'payloadpayload');
    socketRef.current.emit('sendMessage', payload);
    setMessage('');
  };

  console.log(passenger, '49963A');
  const renderItem = ({item}) => {
    const messageAlignment = item.passenger
      ? {
          ...styles.sentMessage,
          alignSelf: passenger ? 'flex-end' : 'flex-start',
        }
      : {
          ...styles.receivedMessage,
          alignSelf: passenger ? 'flex-start' : 'flex-end',
        };

    return (
      <View style={[styles.messageContainer, messageAlignment]}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [ridePrice, setRidePrice] = useState(null);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    console.log('closedd');
  };

  const [modalVisibles, setModalVisibles] = useState(false);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const openModals = (rideStatus: any) => {
    setIsSuccess(false);
    setStatus(rideStatus);
    setModalVisibles(true);
  };

  const handleConfirm = (ratingCount: any) => {
    setIsLoading(true); // Start loading
    setIsSuccess(false); // Reset success state before making request
    // Example data to send to the API (replace with your actual data)
    const requestData = {
      requestId: requestID, // Replace with actual requestId
      type: type, // Could be "ride" or "delivery"
      chatId: chatID, // Replace with actual chatId
      requestType: status, // Adjust based on the action
      driverId: userId, // Replace if needed
      amount: accessToken?.price, // Replace with actual amount if applicable
      userId: userId,
      ratingCount: ratingCount || '', // Use the passed ratingCount value
    };
    console.log(requestData, 'ratingCountratingCount');
   
    axios
      .post(`${NEW_BASE_URL}/api/requests`, requestData) // Make the API request
      .then(response => {
        console.log('API Response:', response.data); // Log the response data

        setIsLoading(false); // Stop loading once the request is successful
        setIsSuccess(true); // Set success state to true
        fetchChatDetails();
      })
      .catch(error => {
        setIsLoading(false); // Stop loading if there's an error
        setIsSuccess(false); // Optionally handle failure state (could display error message)

        console.error('API Error:', error.response || error.message);
      });
  };

  const handleConfirms = () => {
    setIsLoading(true); // Start loading
    setIsSuccess(false); // Reset success state before making request

    // Example data to send to the API (replace with your actual data)
    const requestData = {
      requestId: requestID, // Replace with actual requestId
      type: type, // Could be "ride" or "delivery"
      chatId: chatID, // Replace with actual chatId
      requestType: status, // Adjust based on the action
      driverId: userId, // Replace if needed
      amount: accessToken?.price, // Replace with actual amount if applicable
      userId: userId,
      // ratingCount: ratingCount ? ''
    };

    axios
      .post(`${NEW_BASE_URL}/api/requests`, requestData) // Make the API request
      .then(response => {
        console.log('API Response:', response.data); // Log the response data

        setIsLoading(false); // Stop loading once the request is successful
        setIsSuccess(true); // Set success state to true
        fetchChatDetails();
      })
      .catch(error => {
        setIsLoading(false); // Stop loading if there's an error
        setIsSuccess(false); // Optionally handle failure state (could display error message)

        console.error('API Error:', error.response || error.message);
      });
  };

  const handleClose = () => {
    setModalVisibles(false);
    fetchChatDetails();
  };

  const [reference, setReference] = useState('');

  // const handleSubmitRating = async () => {
  //   if (!userId || !rating || !requestId || !type) {
  //     Alert.alert('Error', 'All fields are required.');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('http://your-server-url/rate', {
  //       userId,
  //       rating: parseFloat(rating),
  //       requestId: accessToken. ,
  //       type,
  //     });

  //     Alert.alert('Success', response.data.message);
  //   } catch (error) {
  //     Alert.alert(
  //       'Error',
  //       error.response?.data?.message || 'Something went wrong',
  //     );
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
            <Text style={styles.headerText}>{UserName}</Text>
          </TouchableOpacity>
        </View>
        {!accessToken.startRide &&
          !passenger &&
          accessToken.price >= 1 &&
          accessToken.paid && (
            <TouchableOpacity
              style={[styles.setPriceButton, {marginTop: 0}]}
              onPress={() => openModals('startRide')}>
              <Text style={styles.setPriceText}>
                User has paid {accessToken?.price}NGN - Start Ride
              </Text>
            </TouchableOpacity>
          )}
        {!passenger &&
          !accessToken.startRide &&
          !accessToken.paid &&
          accessToken.price >= 1 && (
            <TouchableOpacity style={[styles.setPriceButton, {marginTop: 0}]}>
              <Text style={styles.setPriceText}>
                We'll Notify you the user pays - {accessToken.price}NGN
              </Text>
            </TouchableOpacity>
          )}
        {accessToken?.price >= 1 && passenger && !accessToken?.paid && (
          <TouchableOpacity
            style={[styles.setPriceButton, {marginTop: 24, borderRadius: 0}]}
            onPress={() => {
              paystackWebViewRef.current.startTransaction();
            }}>
            <Text style={styles.setPriceText}>
              Pay NGN{accessToken?.price} for this Ride
            </Text>
          </TouchableOpacity>
        )}

        {passenger && accessToken.endRide && !accessToken.confirmRide && (
          <TouchableOpacity
            style={[styles.setPriceButton, {marginTop: 0}]}
            onPress={() => openModals('confirmRide')}>
            <Text style={styles.setPriceText}>Confirm Request</Text>
          </TouchableOpacity>
        )}

        {accessToken.startRide && (
          <TouchableOpacity
            style={[
              styles.setPriceButton,
              {marginTop: 0, backgroundColor: 'gray'},
            ]}
            onPress={() => openModals('reportRide')}>
            <Text style={styles.setPriceText}>Report Ride</Text>
          </TouchableOpacity>
        )}

        {accessToken.startRide && !accessToken.endRide && !passenger && (
          <TouchableOpacity
            style={[
              styles.setPriceButton,
              {marginTop: 0, backgroundColor: 'red'},
            ]}
            onPress={() => openModals('endRide')}>
            <Text style={styles.setPriceText}>End Ride</Text>
          </TouchableOpacity>
        )}

        <StatusModal
          visible={modalVisibles}
          status={status}
          isLoading={isLoading} // Pass loading state
          isSuccess={isSuccess} // Pass success state
          onConfirm={handleConfirm}
          onClose={handleClose}
        />

        {!passenger &&
          (accessToken?.price === null || accessToken?.price === 0) && (
            <TouchableOpacity style={styles.setPriceButton} onPress={openModal}>
              <Text style={styles.setPriceText}>
                Click to Set Price for this Ride
              </Text>
            </TouchableOpacity>
          )}
        {accessToken?.endRide && accessToken?.confirmRide && (
          <TouchableOpacity style={styles.setPriceButton}>
            <Text
              style={[
                {
                  color: '#fff',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'Plus Jakarta Sans Bold',
                },
              ]}>
              Ride Ended
            </Text>
          </TouchableOpacity>
        )}
        {!accessToken?.rateRide && accessToken?.confirmRide && (
          <TouchableOpacity
            style={[styles.setPriceButton, {backgroundColor: 'yellow'}]}
            onPress={() => openModals('rateRide')}>
            <Text
              style={[
                {
                  color: '#000',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'Plus Jakarta Sans Bold',
                },
              ]}>
              Rate Ride
            </Text>
          </TouchableOpacity>
        )}
        {accessToken?.paid === true && passenger && !accessToken?.endRide && (
          <TouchableOpacity style={styles.setPriceButton}>
            <Text
              style={[
                {
                  color: '#fff',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'Plus Jakarta Sans Bold',
                },
              ]}>
              {' '}
              You Paid:
              {new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2, // Ensures 2 decimal places
                currencyDisplay: 'symbol', // Ensures Naira sign is used
              }).format(price)}
            </Text>
          </TouchableOpacity>
        )}

        <Paystack
          paystackKey="pk_live_a6e33d0231171a1f1cfe03b53b37a9451e33a378"
          billingEmail={userProfile?.email}
          amount={price / 10}
          onCancel={() => {
            console.log('Payment cancelled by the user');
          }}
          onSuccess={async response => {
            console.log('Payment successful:', response);
            try {
              const result = await axios.post(
                `${NEW_BASE_URL}/api/update-data`,
                {
                  chatID,
                  type,
                  requestID,
                  driverID,
                },
              );

              console.log('Server response:', result.data);
              if (result.data.message === 'Update successful') {
                fetchChatDetails();
              }
            } catch (error) {
              console.error('Error updating server after payment:', error);
              if (error.response) {
                console.log('Error response data:', error.response.data);
                console.log('Error response status:', error.response.status);
                console.log('Error response headers:', error.response.headers);
              } else if (error.request) {
                console.log('Error request data:', error.request);
              } else {
                console.log('General error message:', error.message);
              }
            }
          }}
          ref={paystackWebViewRef}
        />
        <View>
          <SetPriceModal
            visible={modalVisible}
            onClose={closeModal}
            chatID={chatID}
            onPriceSet={handlePriceSet} // Pass callback to reload parent
          />
        </View>
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef} // Attach the ref to FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
        />
        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendButton,
              message.trim()
                ? styles.sendButtonActive
                : styles.sendButtonDisabled,
            ]}
            disabled={!message.trim()}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,

    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontFamily: 'Plus Jakarta Sans SemiBold',
    fontSize: 13,
    color: '#515FDF',
  },
  messageList: {
    flexGrow: 1,
    padding: 10,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#515FDF',
  },
  receivedMessage: {
    backgroundColor: '#49963A',
  },
  messageText: {
    fontSize: 16,
    color: '#fff', // White text for sent messages
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: '#515FDF',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  typingIndicator: {
    fontStyle: 'italic',
  },
  setPriceButton: {
    backgroundColor: '#515FDF',
    padding: 16,
  },
  setPriceText: {
    fontFamily: 'Plus Jakarta Sans Medium',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 800,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  confirmModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#fff',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#fff',
  },
  webViewContainer: {
    flex: 1,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff0000',
    paddingBottom: 36,
    paddingTop: 24,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#ff0000',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default ChatComponent;

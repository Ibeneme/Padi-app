import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import io from 'socket.io-client';
import {
  SOCKET_SERVER_URL,
  getChatID,
  getChatMessaging,
} from '../../Redux/Chats/chatSlice';
import {useDispatch} from 'react-redux';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {
  fetchDeliverParcelByID,
  fetchParcelByid,
  fetchUserProfile,
  fetchUserProfileByID,
  paymentUrlCheckout,
} from '../../Redux/Users/User';
import SetPriceModal from './SetPriceModal';
//import WebViewComponent from './WebViewComponent';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserById } from '../../Redux/Auth/Auth';

const ChatComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    messageIDs,
    delivery_parcel_id,
    userProfileDriver_first_name,
    userProfileDriver_last_name,
  } = route.params || null;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const dispatch = useDispatch();
  const flatListRef = useRef(null); // Reference to the FlatList
  const {fetchMessageIDs} = route.params || null;
  // Initialize socket connection
  const socket = io(SOCKET_SERVER_URL);

  const RequestID = messageIDs?.RequestID || delivery_parcel_id;
  const providerID = messageIDs?.providerID || null;

  const [userProfileDriver, setUserProfileDriver] = useState([]);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false); // Make the modal visible by default
  const [isWebViewVisible, setWebViewVisible] = useState(false); // WebView modal visibility state
  const [paymentUrl, setPaymentUrl] = useState(' '); // WebView modal visibility state

  const [userProfile, setUserProfile] = useState('');
  const [postData, setPosts] = useState([]);

  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [itemPost, setItemPost] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          const storedAccessToken = await AsyncStorage.getItem('access_token');
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
          console.log(storedUserId, 'storedUserId');
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

  useEffect(() => {
    // Automatically show the confirmation modal when the component mounts
    setConfirmModalVisible(true);
    // fetchUserDetails();
  }, []);

  const closeConfirmModal = () => {
    setConfirmModalVisible(false);
  };

  const openWebView = () => {
    // console.log('setPaymentUrl console');
    dispatch(paymentUrlCheckout(10000))
      .unwrap()
      .then(result => {
        console.log('setPaymentUrl', result);
        setPaymentUrl(result?.checkout_url);
        if (result?.checkout_url) {
          setWebViewVisible(true);
        }
      })
      .catch(error => {
        console.error(error);
      });

    setConfirmModalVisible(false);
  };

  const setPrice = () => {
    dispatch(setRidePrice(payload))
      .unwrap()
      .then(result => {
        console.log('setRidePrice', result);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const closeWebView = () => {
    setWebViewVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      const users = {
        userId1: RequestID,
        userId2: providerID,
      };

      if (fetchMessageIDs) {
        dispatch(getChatMessaging(fetchMessageIDs))
          .unwrap()
          .then(result => {
            setMessages(result);
            setChatId(fetchMessageIDs);
            socket.emit('joinGroup', result);
            console.log(result, 'resultresultresultresult');
          })
          .catch(error => {
            console.error('Error retrieving chat ID:', error);
          });
      } else {
        // Fetch chat ID and join the socket room
        dispatch(getChatID(users))
          .unwrap()
          .then(result => {
            setChatId(result);
            socket.emit('joinGroup', result);
          })
          .catch(error => {
            console.error('Error retrieving chat ID:', error);
          });
      }

      return () => {
        socket.disconnect();
      };
    }, [dispatch, RequestID, providerID]),
  );

  useFocusEffect(
    useCallback(() => {
      if (chatId) {
        // Fetch initial chat messages
        dispatch(getChatMessaging(chatId))
          .unwrap()
          .then(result => {
            setMessages(result);
          })
          .catch(error => {
            console.error('Error retrieving chat messages:', error);
          });
      }

      return () => {
        socket.disconnect();
      };
    }, [dispatch, chatId]),
  );

  useEffect(() => {
    if (chatId) {
      const handleReceiveMessage = newMessage => {
        console.log('Received message:', newMessage);

        if (newMessage.groupId === chatId) {
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      };

      const handleIsTyping = ({userId, isTyping}) => {
        setIsTyping(isTyping && userId !== RequestID);
      };

      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('isTyping', handleIsTyping);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
        socket.off('isTyping', handleIsTyping);
      };
    }
  }, [chatId, socket, RequestID]);

  const handleTyping = text => {
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        groupId: chatId,
        userId: RequestID,
        isTyping: true,
      });
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      socket.emit('typing', {
        groupId: chatId,
        userId: RequestID,
        isTyping: false,
      });
    }
    setMessage(text);
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

  const handleSavePrice = price => {
    setRidePrice(price); // Store the price once the user saves it
  };

  const sendMessage = () => {
    if (fetchMessageIDs) {
      if (message.trim() && chatId) {
        socket.emit('sendMessage', {
          groupId: chatId,
          message,
          userId: RequestID,
        });
        setMessage('');
        setIsTyping(false);
      }
    } else {
      if (message.trim() && chatId) {
        socket.emit('sendMessage', {
          groupId: chatId,
          message,
          userId: RequestID,
        });
        setMessage('');
        setIsTyping(false);
      }
    }
  };

  const handleKeyboardDismiss = () => {
    setIsTyping(false);
  };

  const renderItem = ({item}) => {
    const timeSent = new Date(item?.timeSent);
    const formattedTime = timeSent.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const isUserMessage = item.userId === RequestID;

    return (
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor: isUserMessage ? '#515FDF' : '#fff',
            alignSelf: isUserMessage ? 'flex-end' : 'flex-start',
            color: isUserMessage ? '#fff' : '#121212',
          },
        ]}>
        <Text
          style={[
            styles.messageText,
            {
              fontFamily: 'Plus Jakarta Sans Regular',
              color: isUserMessage ? '#fff' : '#121212',
            },
          ]}>
          {item?.message}
        </Text>
        <Text
          style={[
            styles.senderText,
            {color: isUserMessage ? '#fff' : '#121212'},
          ]}>
          {formattedTime}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{padding: 16, borderBottomWidth: 0.0, backgroundColor: '#fff'}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 27,
          }}>
          <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
            <Text
              style={{
                fontFamily: 'Plus Jakarta Sans SemiBold',
                color: '#515FDF',
                fontSize: 14,
              }}>
              {userProfileDriver_first_name}
              {userProfileDriver_last_name}
            </Text>
          </View>
          {isTyping && (
            <View
              style={{
                backgroundColor: '#515FDF',
                padding: 7,
                borderRadius: 24,
                paddingHorizontal: 10,
              }}>
              <Text
                style={[styles.typingIndicator, {color: '#fff', fontSize: 12}]}>
                Typing...
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.setPriceButton} onPress={openModal}>
          <Text style={styles.setPriceText}>
            {' '}
            Click to Set Price for this Ride
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.setPriceButton} onPress={openWebView}>
          <Text style={styles.setPriceText}> Pay for this Ride</Text>
        </TouchableOpacity>

        <SetPriceModal
          visible={modalVisible}
          onClose={closeModal}
          onSavePrice={handleSavePrice}
          // service_id={userDetails?.user_id}
          service_type="Delivery"
          // consumer={userIds}
          currency="NGN"
        />
      </View>

      <Modal
        visible={isWebViewVisible}
        onRequestClose={closeWebView}
        animationType="slide"
        transparent={false}>
        <SafeAreaView style={styles.webViewContainer}>
          <WebView
            source={{uri: paymentUrl}}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                size="large"
                color="#515FDF"
                style={styles.loadingIndicator}
              />
            )}
          />

          <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
            <Text style={styles.closeButtonText}>Cancel Payments</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={100}>
        <View style={{flex: 1}}>
          <View style={{flex: 1, padding: 16}}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({animated: true})
              }
              keyboardShouldPersistTaps="handled"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={handleTyping}
              placeholder="Type a message"
              onFocus={() => setIsTyping(false)}
              onBlur={handleKeyboardDismiss}
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Plus Jakarta Sans Bold',
  },
  senderText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
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
    color: '#fff',
  },
});

export default ChatComponent;

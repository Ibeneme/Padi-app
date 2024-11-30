import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {getChatMessagingByUser} from '../../Redux/Chats/chatSlice';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {fetchParcelByid, fetchUserProfileByID} from '../../Redux/Users/User'; // Ensure this action is correct
import {NEW_BASE_URL} from '../../Redux/NewBaseurl/NewBaseurl';
const SOCKET_SERVER_URL = NEW_BASE_URL;
const API_BASE_URL = `${NEW_BASE_URL}/api/chat`;
import io from 'socket.io-client';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserById} from '../../Redux/Auth/Auth';

const PassengerLists = () => {
  const route = useRoute();
  const {chatID, type, driverID} = route.params;
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({}); // State to store user details mapped by ID
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [price, setPriceDriver] = useState(null);
  const [userProfile, setUserProfile] = useState('');
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState([]);
  const socketRef = useRef();

  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          setLoading(false);
          const storedUserId = await AsyncStorage.getItem('user_id');
          const storedAccessToken = await AsyncStorage.getItem('access_token');
          setUserId(storedUserId);
          dispatch(fetchUserById(storedUserId))
            .then(response => {
              setUserProfile(response?.payload);
            })
            .catch(error => {
              //  console.log(error);
            });
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };
      const fetchChatDetails = async () => {
        try {
          console.log('Fetching chat details...');
          const ChatID = chatID;
          console.log(chatID, 'chatIDchatIDchatIDchatIDchatIDchatID');
          // Make the request
          const response = await axios.get(
            `${NEW_BASE_URL}/api/api-fetch-chat/api/${ChatID}`,
          );

          // Log the response to debug
          console.log('Response data:', response.data);

          if (response.status === 200) {
            const chatData = response.data;
            setChatData(chatData); // assuming setPriceData updates your state
            console.log('Chat data:', chatData);
          } else {
            console.log('Unexpected response status:', response.status);
          }
        } catch (error) {
          // Log errors to understand any failure
          console.log('Error fetching chat:', error);
        }
      };

      fetchChatDetails();
      getUserData();
    }, []),
  );

  if (loading) {
    return (
      <SafeAreaView style={{flex: 1, padding: 0, backgroundColor: '#f4f4f4'}}>
        <View style={{padding: 16}}>
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeftSVG width={16} height={16} color="#515FDF" />
            </TouchableOpacity>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#515FDF" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{flex: 1, padding: 0, backgroundColor: '#f4f4f4'}}>
        <View style={{padding: 16}}>
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeftSVG width={16} height={16} color="#515FDF" />
            </TouchableOpacity>
            <Text style={[styles.title, {color: '#ff0000'}]}>
              Cannot Get Messages for this Request
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  console.log(type, 'typetypetype')
  const renderChatItem = ({item}) => (
    <TouchableOpacity
      style={{
        padding: 10,
        backgroundColor: '#515FDF',
        marginBottom: 10,
        borderRadius: 5,
        padding: 16,
      }}
      onPress={() =>
        navigation.navigate('ChatComponent', {
          chatID: item?.chatID,
          type: type,
          driverID: driverID,
          requestID: item?.passID,
        })
      } // Pass the chatID to the next page
    >
      <Text style={{color: '#fff', fontSize: 16}}>
        {item?.user_first_name} {item?.user_last_name}
      </Text>
    </TouchableOpacity>
  );

  console.log(chatData, 'chatDatachatData');
  return (
    <SafeAreaView style={{flex: 1, padding: 0, backgroundColor: '#f4f4f4'}}>
      <View style={{padding: 16}}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>
          <Text style={styles.title}>Messages for this Request</Text>
        </View>
        <FlatList
          data={chatData}
          keyExtractor={item => item._id}
          renderItem={renderChatItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  messageContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Plus Jakarta Sans SemiBold',
    fontWeight: 600,
  },
  userText: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    marginTop: 32,
    marginBottom: 10,
  },
});

export default PassengerLists;

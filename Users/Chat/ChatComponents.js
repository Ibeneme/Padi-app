import React, {useCallback, useEffect, useState} from 'react';
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
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import io from 'socket.io-client';
import {SOCKET_SERVER_URL, getChatID} from '../../Redux/Chats/chatSlice';
import {useDispatch} from 'react-redux';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const ChatComponentss = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId1, userId2} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const dispatch = useDispatch();
  const socket = io(SOCKET_SERVER_URL);

  useFocusEffect(
    useCallback(() => {
      dispatch(getChatID([userId1, userId2]))
        .unwrap()
        .then(result => {
          setChatId(result);
          socket.emit('joinGroup', result);
        })
        .catch(error => {
          console.log('Error retrieving chat ID:', error);
        });

      return () => {
        socket.disconnect();
      };
    }, [dispatch, socket, userId1, userId2]),
  );

  useEffect(() => {
    socket.on('receiveMessage', ({message, userId, groupId, timeSent}) => {
      if (groupId === chatId) {
        setMessages(prevMessages => [
          ...prevMessages,
          {message, userId, timeSent},
        ]);
      }
    });

    socket.on('isTyping', ({userId: typingUserId, isTyping}) => {
      setIsTyping(isTyping && typingUserId !== socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, chatId]);

  const handleTyping = text => {
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', {groupId: chatId, userId: userId1, isTyping: true});
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      socket.emit('typing', {
        groupId: chatId,
        userId: userId1,
        isTyping: false,
      });
    }
    setMessage(text);
  };

  const sendMessage = () => {
    if (message.trim() && chatId) {
      socket.emit('sendMessage', {groupId: chatId, message, userId: userId1});
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyboardDismiss = () => {
    setIsTyping(false);
  };

  const renderItem = ({item}) => {
    const timeSent = new Date(item.timeSent);
    const formattedTime = timeSent.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return (
      <View style={styles.messageContainer}>
        <Text
          style={[
            styles.messageText,
            {fontfamily: 'Plus Jakarta Sans Regular'},
          ]}>
          {item.message}
        </Text>
        <Text style={[styles.senderText]}>{formattedTime}</Text>
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
              Ibeneme Ikenna
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={100}>
        <View style={{flex: 1}}>
          <View style={{flex: 1, padding: 16}}>
            <FlatList
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{flexGrow: 1}}
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
    fontfamily: 'Plus Jakarta Sans Bold',
  },
  senderText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontfamily: 'Plus Jakarta Sans Regular',
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
});

export default ChatComponentss;

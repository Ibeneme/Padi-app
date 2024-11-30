import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ChatIcon from './ChatIcon'; // Adjust the path as necessary

const FloatingSupportButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => navigation.navigate('TawkToChat')}>
      <ChatIcon width={28} height={28} fill="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    backgroundColor: '#515FDF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default FloatingSupportButton;

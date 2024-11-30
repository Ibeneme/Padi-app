import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-remix-icon'; // Import Icon from remix-icon

const HistoryLogs = ({receiversName, icon, location, price}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
      }}>
      {/* Left side with icon and information */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
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
          <Icon name="truck-fill" size={20} color="#515FDF" />
        </View>
        <View>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Plus Jakarta Sans SemiBold',
            }}>
            {receiversName}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Plus Jakarta Sans Regular',
              color: '#66666695',
            }}>
            {location}
          </Text>
        </View>
      </View>

      {/* Right side with price */}
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'Plus Jakarta Sans Regular',
          color: 'gray',
        }}>
        {price}
      </Text>
    </View>
  );
};

export default HistoryLogs;

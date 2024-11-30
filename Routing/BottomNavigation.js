import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NewHome from '../Users/Menu/NewHome';
import Deliver from '../Users/Menu/Deliver';
import JoinRide from '../Users/Menu/JoinRide';
import User from '../Users/Menu/User';
import {Text} from 'react-native';
import Icon from 'react-native-remix-icon'; // Import Icon from remix-icon
import RequestList from '../Users/Menu/Request';
import SendersList from '../Users/Deliver/AllSendersList';
import GetDrivers from '../Users/Passenger/GetDrivers';
import ChatComponent from '../Users/Chat/ChatComponent';
import EnterUserIDs from '../Users/Chat/EnterUserIDs';
import { updateUserProfile } from '../Redux/Users/User';

const Tab = createBottomTabNavigator();

const tabBarIconStyle = {
  width: 24,
  color: '#515FDF',
  fontFamily: 'Plus Jakarta Sans Regular',
};

const tabBarLabelStyle = {
  fontFamily: 'Plus Jakarta Sans Regular',
  fontSize: 12,
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          paddingTop: 12,
        },
        headerStyle: {
          borderBottomWidth: 3,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={NewHome}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? '#515FDF' : '#666666',
                  fontFamily: focused
                    ? 'Plus Jakarta Sans Bold'
                    : 'Plus Jakarta Sans Regular',
                  fontSize: 12,
                },
              ]}>
              Home
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="home-fill" // Replace with the name of the Remix icon you want to use
              style={[
                tabBarIconStyle,
                {
                  color: focused ? '#515FDF' : '#66666645',
                  fontFamily: focused
                    ? 'Plus Jakarta Sans Bold'
                    : 'Plus Jakarta Sans Regular',
                },
              ]}
              size={16}
              color={focused ? '#515FDF' : '#666666'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Deliver"
        component={Deliver}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? '#515FDF' : '#666666',
                  fontFamily: focused
                    ? 'Plus Jakarta Sans Bold'
                    : 'Plus Jakarta Sans Regular',
                  fontSize: 12,
                },
              ]}>
              Parcels
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="truck-fill" // Replace with the name of the Remix icon you want to use
              style={[
                tabBarIconStyle,
                {color: focused ? '#515FDF' : '#666666'},
              ]}
              size={16}
              color={focused ? '#515FDF' : '#666666'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="JoinRide"
        component={JoinRide}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? '#515FDF' : '#666666',
                  fontFamily: focused
                    ? 'Plus Jakarta Sans Bold'
                    : 'Plus Jakarta Sans Regular',
                  fontSize: 12,
                },
              ]}>
              Rides
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="car-fill" // Replace with the name of the Remix icon you want to use
              style={[
                tabBarIconStyle,
                {color: focused ? '#515FDF' : '#666666'},
              ]}
              size={16}
              color={focused ? '#515FDF' : '#666666'}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="updateUserProfile"
        component={updateUserProfile}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? '#515FDF' : '#666666',
                  fontFamily: focused
                    ? 'Plus Jakarta Sans Bold'
                    : 'Plus Jakarta Sans Regular',
                  fontSize: 12,
                },
              ]}>
              Profile
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="user-fill" // Replace with the name of the Remix icon you want to use
              style={[
                tabBarIconStyle,
                {color: focused ? '#515FDF' : '#666666'},
              ]}
              size={16}
              color={focused ? '#515FDF' : '#666666'}
            />
          ),
        }}
      /> */}

      <Tab.Screen
        name="user"
        component={User}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? '#515FDF' : '#666666',
                  fontFamily: focused
                    ? 'Plus Jakarta Sans Bold'
                    : 'Plus Jakarta Sans Regular',
                  fontSize: 12,
                },
              ]}>
              Profile
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name="user-fill" // Replace with the name of the Remix icon you want to use
              style={[
                tabBarIconStyle,
                {color: focused ? '#515FDF' : '#666666'},
              ]}
              size={16}
              color={focused ? '#515FDF' : '#666666'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;

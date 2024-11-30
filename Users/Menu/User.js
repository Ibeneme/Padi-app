import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-remix-icon';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {fetchAllPosts} from '../../Redux/Posts/Post';
import {fetchUserById, logoutUs} from '../../Redux/Auth/Auth';
import RNSecureStorage from 'rn-secure-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import FloatingSupportButton from '../Support/FloatingButton';

const User = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState('');
  const {isLoading} = useSelector(state => state.user);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          const storedAccessToken = await AsyncStorage.getItem('access_token');
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };

      getUserData();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (userId && accessToken) {
        dispatch(fetchUserById(userId))
          .then(response => {
            setUserProfile(response?.payload);
          })
          .catch(error => {
            console.log('Error fetching user profile:', error);
          });

        dispatch(fetchAllPosts())
          .then(response => {})
          .catch(error => {});
      }
    }, [dispatch, userId, accessToken]),
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('phone_number');
      await AsyncStorage.removeItem('password');

      RNSecureStorage.clear()
        .then(res => {
          console.log('All items deleted from secure storage:', res);
          dispatch(logoutUs());
        })
        .catch(err => {
          console.error('Failed to delete items from secure storage:', err);
        });

      navigation.navigate('Onboarding');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleCopyReferralCode = referralCode => {
    Clipboard.setString(referralCode);
    alert('Referral code copied to clipboard!');
  };

  const handleNext = () => {
    console.log('Next button pressed');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <ScrollView style={{padding: 16}}>
        <View style={[styles.topView]}></View>

        <View style={[styles.flex, {marginTop: 36}]}>
          <View>
            <Text style={styles.hi}>
              {userProfile.first_name} {userProfile.last_name}
            </Text>
            <Text style={[styles.title, {fontSize: 12, color: '#666'}]}>
              {userProfile.email}
            </Text>
            <View
              style={{
                backgroundColor: '#515FDF12',
                padding: 16,
                borderRadius: 245,
                marginTop: 24,
              }}>
              <View>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() =>
                    handleCopyReferralCode(userProfile?.referral_code)
                  }>
                  <Text style={[styles.title, {color: '#515FDF'}]}>
                    Referral Code:{' '}
                  </Text>
                  <Text
                    style={[
                      styles.title,
                      {fontWeight: 'bold', color: '#515FDF'},
                    ]}>
                    {userProfile?.referral_code || 'N/A'}
                  </Text>
                  <Icon
                    name="file-copy-fill"
                    size={18}
                    width={20}
                    color="#515FDF"
                    style={{marginLeft: 4}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('updateprofile')}
          style={styles.flex}>
          <View
            style={{
              backgroundColor: '#515FDF12',
              padding: 10,
              borderRadius: 245,
              marginTop: 8,
            }}>
            <Icon name="user-fill" size={18} width={20} color="#515FDF" />
          </View>
          <Text style={[styles.title]}>Profile Information</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('TawkToChat')}
          style={styles.flex}>
          <View
            style={{
              backgroundColor: '#515FDF12',
              padding: 10,
              borderRadius: 245,
              marginTop: 8,
            }}>
            <Icon name="wallet-fill" size={18} width={20} color="#515FDF" />
          </View>
          <Text style={[styles.title]}>Contact Support</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Earnings')}
          style={styles.flex}>
          <View
            style={{
              backgroundColor: '#515FDF12',
              padding: 10,
              borderRadius: 245,
              marginTop: 8,
            }}>
            <Icon name="wallet-fill" size={18} width={20} color="#515FDF" />
          </View>
          <Text style={[styles.title]}>Referral Earnings</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => navigation.navigate('Refunds')}
          style={styles.flex}>
          <View
            style={{
              backgroundColor: '#515FDF12',
              padding: 10,
              borderRadius: 245,
              marginTop: 8,
            }}>
            <Icon name="wallet-fill" size={18} width={20} color="#515FDF" />
          </View>
          <Text style={[styles.title]}>Refunds</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Balance')}
          style={styles.flex}>
          <View
            style={{
              backgroundColor: '#515FDF12',
              padding: 10,
              borderRadius: 245,
              marginTop: 8,
            }}>
            <Icon name="wallet-fill" size={18} width={20} color="#515FDF" />
          </View>
          <Text style={[styles.title]}>Balance</Text>
        </TouchableOpacity>
        {userProfile?.is_driver && (
          <View>
            {' '}
            <TouchableOpacity
              onPress={() => navigation.navigate('Earnings')}
              style={styles.flex}>
              <View
                style={{
                  backgroundColor: '#515FDF12',
                  padding: 10,
                  borderRadius: 245,
                  marginTop: 8,
                }}>
                <Icon name="wallet-fill" size={18} width={20} color="#515FDF" />
              </View>
              <Text style={[styles.title]}>Earnings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('BecomeADriver')}
              style={styles.flex}>
              <View
                style={{
                  backgroundColor: '#515FDF12',
                  padding: 10,
                  borderRadius: 245,
                  marginTop: 8,
                }}>
                <Icon name="wallet-fill" size={18} width={20} color="#515FDF" />
              </View>
              <Text style={[styles.title]}>Become a Driver</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('Withdrawals')}
          style={styles.flex}>
          <View
            style={{
              backgroundColor: '#515FDF12',
              padding: 10,
              borderRadius: 245,
              marginTop: 8,
            }}>
            <Icon name="wallet-fill" size={18} width={20} color="#515FDF" />
          </View>
          <Text style={[styles.title]}>Withdrawals</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.flex}>
          <View
            style={{
              backgroundColor: '#ff000012',
              padding: 10,
              borderRadius: 245,
            }}>
            <Icon name="login-box-fill" size={18} width={20} color="#ff0000" />
          </View>
          <Text style={[styles.title, {color: '#ff0000'}]}>Log Out</Text>
        </TouchableOpacity>

        <View style={{marginBottom: 200}}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hi: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Medium',
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  walletInfoContainer: {
    marginTop: 24,
    backgroundColor: '#F7F7F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  walletInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletInfoText: {
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Medium',
    marginLeft: 12,
    color: '#515FDF',
  },
  walletAmount: {
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Bold',
    marginLeft: 'auto',
    color: '#515FDF',
  },
});

export default User;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NEW_BASE_URL} from '../../Redux/NewBaseurl/NewBaseurl';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const Earnings = () => {
  const [earnings, setEarnings] = useState([]); // State to hold earnings data (array)
  const [totalEarnings, setTotalEarnings] = useState(0); // State to hold total earnings
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState(null); // Error state for API call
  const [userId, setUserId] = useState(null); // State to store userId
  const type = 'earnings'; // or 'withdrawals' or 'refunds'

  const EXCHANGE_RATE = 800; // 1 USD = 800 NGN, update this with real-time value if needed

  // Helper function to format the date to "1st Jan 2023"
  const formatDate = date => {
    const day = new Date(date).getDate();
    const month = new Date(date).toLocaleString('default', {month: 'short'});
    const year = new Date(date).getFullYear();

    let daySuffix = 'th';
    if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
    if (day === 2 || day === 22) daySuffix = 'nd';
    if (day === 3 || day === 23) daySuffix = 'rd';

    return `${day}${daySuffix} ${month} ${year}`;
  };

  // Fetch userId from AsyncStorage
  const fetchUserId = () => {
    AsyncStorage.getItem('user_id')
      .then(userIdFromStorage => {
        if (userIdFromStorage !== null) {
          setUserId(userIdFromStorage); // Set userId in state
        } else {
          setError('User ID not found');
        }
      })
      .catch(() => {
        setError('Error fetching user ID');
      });
  };

  useEffect(() => {
    fetchUserId(); // Fetch user ID from AsyncStorage

    if (userId) {
      setLoading(true); // Start loading when the request begins

      axios
        .get(`${NEW_BASE_URL}/api/fetch-details/chat/chat/${type}/${userId}`)
        .then(response => {
          console.log(response.data, 'responseresponse');
          if (response.data.success) {
            setEarnings(response.data.earnings); // Update earnings state with the array
            setTotalEarnings(response.data.totalEarnings); // Update total earnings
          } else {
            setError('Failed to fetch earnings data'); // Handle failure
          }
        })
        .catch(err => {
          setError('Error fetching data'); // Handle error
          console.error('Error fetching data:', err);
        })
        .finally(() => {
          setLoading(false); // Stop loading once the request is complete
        });
    }
  }, [userId]); // Fetch data when userId changes

  // Sorting the earnings to show most recent first
  const sortedEarnings = [...earnings].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftSVG width={16} height={16} color="#515FDF" />
        </TouchableOpacity>
      </View>

      <View style={{padding: 16}}>
        <Text style={styles.heading}>Earnings</Text>
        {loading ? (
          <Modal transparent={true} animationType="fade" visible={loading}>
            <View style={styles.modalOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          </Modal>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View>
            <View style={styles.earningsDetail}>
              <Text style={styles.detailLabel}>Total Earnings:</Text>
              <Text style={styles.detailValue}>
                ₦{totalEarnings.toFixed(2)} {/* Convert to Naira */}
              </Text>
            </View>

            <Text
              style={[
                styles.detailLabel,
                {
                  marginTop: 24,
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: '700',
                },
              ]}>
              All Earnings
            </Text>

            {/* Check if earnings are empty */}
            {earnings.length === 0 ? (
              <Text style={styles.noEarningsText}>No earnings available.</Text>
            ) : (
              <FlatList
                data={sortedEarnings}
                keyExtractor={item => item.rideId}
                renderItem={({item}) => (
                  <TouchableOpacity style={styles.earningsItem}>
                    <View>
                      <Text style={styles.itemLabel}>Amount:</Text>
                      <Text style={styles.itemValue}>
                        ₦{item?.amount?.toFixed(2)} {/* Convert to Naira */}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={[
                          styles.itemValue,
                          {fontSize: 12, color: '#666', fontWeight: '400'},
                        ]}>
                        {formatDate(item.date)} {/* Format the date */}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Plus Jakarta Sans Bold',
    marginBottom: 20,
    color: '#333',
  },
  earningsDetail: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  detailValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#515FDF',
    fontFamily: 'Plus Jakarta Sans ExtraBold',
  },
  earningsItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
  },
  itemLabel: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Plus Jakarta Sans Bold',
    marginTop: 6,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontFamily: 'Plus Jakarta Sans Regular',
    textAlign: 'center',
  },
  noEarningsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Opacity over background
  },
});

export default Earnings;

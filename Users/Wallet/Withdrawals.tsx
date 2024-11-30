
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
  ScrollView,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NEW_BASE_URL} from '../../Redux/NewBaseurl/NewBaseurl';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // Refreshing state
  const type = 'withdrawals';
  const EXCHANGE_RATE = 800;

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

  const fetchUserId = () => {
    AsyncStorage.getItem('user_id')
      .then(userIdFromStorage => {
        if (userIdFromStorage !== null) {
          setUserId(userIdFromStorage);
        } else {
          setError('User ID not found');
        }
      })
      .catch(() => {
        setError('Error fetching user ID');
      });
  };

  const fetchWithdrawals = () => {
    if (userId) {
      setLoading(true);
      axios
        .get(`${NEW_BASE_URL}/api/fetch-details/chat/chat/${type}/${userId}`)
        .then(response => {
          if (response?.data?.success) {
            setWithdrawals(response.data.withdrawals || []);
            setTotalWithdrawals(response.data.totalWithdrawals || 0);
          } else {
            setError('Failed to fetch withdrawal data');
          }
        })
        .catch(err => {
          setError('Error fetching data');
          console.log('Error fetching data:', err);
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false); // Stop refreshing
        });
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWithdrawals();
    }
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWithdrawals();
  };

  const sortedWithdrawals = [...withdrawals].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const navigation = useNavigation();

  const renderItemDetail = (title, value) => (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const getStatusStyle = status => {
    switch (status) {
      case 'pending':
        return {backgroundColor: '#D3D3D3', color: '#000'};
      case 'rejected':
        return {backgroundColor: '#FF6347', color: '#FFF'};
      case 'accepted':
        return {backgroundColor: '#32CD32', color: '#FFF'};
      default:
        return {backgroundColor: '#FFF', color: '#000'};
    }
  };

  const renderTravelItem = ({item}) => (
    <View style={styles.card} key={item?._id}>
      <Text style={styles.itemValue}>₦{item?.amount?.toFixed(2)}</Text>
      <View style={styles.flexRow}>
        {renderItemDetail('Account Number', item?.accountNumber)}
        {renderItemDetail('Bank', item?.bank)}
        {renderItemDetail('Account Name', item?.accountName)}
        {renderItemDetail('Request Date', formatDate(item?.date))}
      </View>
      <View style={styles.flexRow}>
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: getStatusStyle(item.status).backgroundColor,
            },
          ]}>
          <Text
            style={[
              styles.statusText,
              {color: getStatusStyle(item.status).color},
            ]}>
            {item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftSVG width={16} height={16} color="#515FDF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{padding: 16}}>
          <Text style={styles.heading}>Withdrawals</Text>
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
              <View style={styles.withdrawalDetail}>
                <Text style={styles.detailLabel}>Total Withdrawals:</Text>
                <Text style={styles.detailValues}>
                  ₦{totalWithdrawals.toFixed(2)}
                </Text>
              </View>

              <Text style={styles.detailLabel}>All Withdrawals</Text>

              {withdrawals.length === 0 ? (
                <Text style={styles.noWithdrawalsText}>
                  No withdrawals available
                </Text>
              ) : (
                <FlatList
                  data={sortedWithdrawals}
                  keyExtractor={item => item._id}
                  renderItem={renderTravelItem}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
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
  withdrawalDetail: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  detailValues: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#515FDF',
    fontFamily: 'Plus Jakarta Sans ExtraBold',
  },
  withdrawalItem: {
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
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    borderColor: '#606060',
    borderWidth: 0.4,
    flexDirection: 'column',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Plus Jakarta Sans Bold',
    marginTop: 6,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noWithdrawalsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  flexRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});

export default Withdrawals;

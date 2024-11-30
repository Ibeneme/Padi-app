import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NEW_BASE_URL } from '../../Redux/NewBaseurl/NewBaseurl';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const Balance = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [balance, setBalance] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const type = 'balance';
  const [withdrawalAmountError, setWithdrawalAmountError] = useState('');
  const navigation = useNavigation();

  // Fetch userId from AsyncStorage
  const fetchUserId = () => {
    AsyncStorage.getItem('user_id')
      .then(userIdFromStorage => {
        if (userIdFromStorage) {
          setUserId(userIdFromStorage);
        } else {
          setError('User ID not found');
        }
      })
      .catch(() => {
        setError('Error fetching user ID');
      });
  };

  // Fetch earnings and balance data from the API
  useEffect(() => {
    fetchUserId();

    if (userId) {
      setLoading(true);

      axios
        .get(`${NEW_BASE_URL}/api/fetch-details/chat/chat/${type}/${userId}`)
        .then(response => {
          if (response?.data?.success) {
            setLoading(false);
            setTotalEarnings(response.data.totalBalance || 0);
          } else {
            setError('Failed to fetch earnings data');
          }
        })
        .catch(err => {
          setError('Error fetching earnings data');
          console.log('Error fetching earnings data:', err);
        });
    }
  }, [userId]);

  useEffect(() => {
    // Calculate balance as total earnings (for simplicity, we're using only totalEarnings here)
    setBalance(totalEarnings);
  }, [totalEarnings]);

  const handleRequestWithdrawal = () => {
    if (parseFloat(withdrawalAmount) <= balance) {
      console.log('Requesting withdrawal of:', withdrawalAmount);
      setIsModalVisible(false);

      navigation.navigate('RequestWithdrawal', {
        requestedAmount: withdrawalAmount,
        userId: userId,
      });

      setWithdrawalAmount('');
      setError(null); // Reset error after a successful withdrawal request
    } else {
      setWithdrawalAmountError('Withdrawal amount exceeds available balance');
    }
  };

  const handleWithdrawalInputChange = (text) => {
    // Remove any non-numeric characters (except for a decimal point)
    const numericText = text.replace(/[^0-9.]/g, '');
    setWithdrawalAmount(numericText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftSVG width={16} height={16} color="#515FDF" />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.heading}>Balance</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#515FDF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View>
            <View style={styles.balanceDetail}>
              <Text style={styles.detailLabel}>Balances:</Text>
              <Text style={styles.detailValue}>
                ₦{totalEarnings.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => setIsModalVisible(true)}>
              <Text style={styles.requestButtonText}>Request Withdrawal</Text>
            </TouchableOpacity>

            {/* Withdrawal Modal */}
            <Modal
              transparent={true}
              animationType="fade"
              visible={isModalVisible}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalHeading}>Request Withdrawal</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter withdrawal amount"
                    keyboardType="numeric"
                    value={withdrawalAmount}
                    onChangeText={handleWithdrawalInputChange} // Update the function here
                  />
                  {/* Show error only inside the modal */}
                  {withdrawalAmountError && (
                    <Text style={styles.errorText}>
                      {withdrawalAmountError}
                    </Text>
                  )}

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleRequestWithdrawal}>
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
  balanceDetail: {
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
  requestButton: {
    backgroundColor: '#515FDF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#515FDF',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#515FDF',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default Balance;
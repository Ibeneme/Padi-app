import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import { NEW_BASE_URL } from '../../Redux/NewBaseurl/NewBaseurl';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

const RequestWithdrawal = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedBankUser, setSelectedBankUser] = useState('');
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedAccount, setResolvedAccount] = useState('');
  const [passed, setPassed] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { requestedAmount, userId } = route.params;

  useEffect(() => {
    fetchBanks();
  }, []);

  // Fetch banks from the API
  const fetchBanks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${NEW_BASE_URL}/api/paystack/banks`);
      if (response?.data?.status) {
        setBanks(response.data.data);
      } else {
        setError('Failed to fetch banks.');
      }
    } catch (err) {
      setError('Error fetching banks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle bank selection
  const handleBankSelect = (item) => {
    setPassed(false);
    setSelectedBank(item?.code);
    setSelectedBankUser(item.name);
  };

  // Handle withdrawal request
  const handleWithdrawalRequest = async () => {
    if (!accountNumber || accountNumber.length !== 10) {
      Alert.alert('Invalid Input', 'Account number must be 10 digits.');
      return;
    }
    if (!selectedBank) {
      Alert.alert('Invalid Input', 'Please select a bank.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${NEW_BASE_URL}/api/paystack/resolve-account`, {
        params: { account_number: accountNumber, bank_code: selectedBank },
      });

      setResolvedAccount(response.data.data?.account_name);
      setPassed(true);

      if (response.data.status) {
        Alert.alert('Bank Account Valid', 'Your bank account has been successfully validated.');
      } else {
        setResolvedAccount('Failed to retrieve account name');
        Alert.alert('Request Failed', 'Failed to resolve the account details.');
      }
    } catch (error) {
      setResolvedAccount('Failed to retrieve account name');
      Alert.alert('Request Failed', 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to generate a custom withdrawal ID
  const generateWithdrawalID = (userId, bankCode) => {
    const timestamp = Date.now();
    return `${timestamp}-${userId}-${bankCode}`;
  };

  const withdrawalID = generateWithdrawalID(userId, selectedBank);

  const handleWithdrawalRequests = async () => {
    if (!accountNumber || accountNumber.length !== 10) {
      Alert.alert('Invalid Input', 'Account number must be 10 digits.');
      return;
    }
    if (!selectedBank) {
      Alert.alert('Invalid Input', 'Please select a bank.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${NEW_BASE_URL}/api/paystack/request-withdrawal`, {
        accountNumber,
        accountName: resolvedAccount,
        bank: selectedBankUser,
        bankCode: selectedBank,
        requestedAmount,
        userId,
        withdrawalID,
      });

      if (response.status === 201) {
        Alert.alert('Request Sent', 'Your withdrawal request has been submitted.', [
          { text: 'OK', onPress: () => navigation.navigate('user') },
        ]);
      } else {
        Alert.alert('Request Failed', 'Failed to submit your request. Please try again.');
      }
    } catch (error) {
      Alert.alert('Request Failed', 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftSVG width={16} height={16} color="#515FDF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Request Withdrawal</Text>

        <View style={styles.balanceDetail}>
          <Text style={styles.detailLabel}>Request to Withdraw</Text>
          <Text style={styles.detailValue}>₦{requestedAmount}</Text>
        </View>

        {loading ? (
          <Modal transparent={true} animationType="fade" visible={loading}>
            <View style={styles.modalOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          </Modal>
        ) : (
          <>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={setAccountNumber}
              maxLength={10}
              placeholder="Enter 10-digit account number"
            />

            <Text style={styles.label}>Select Bank</Text>
            <Dropdown
              placeholderStyle={styles.dropdownPlaceholder}
              style={styles.dropdown}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              selectedTextStyle={styles.dropdownSelectedText}
              data={banks}
              labelField="name"
              valueField="code"
              placeholder="Select Bank"
              searchPlaceholder="Search for a bank"
              value={selectedBank}
              onChange={handleBankSelect}
              maxHeight={500}
              search
            />

            {passed && <Text style={styles.accountName}>{resolvedAccount}</Text>}

            <TouchableOpacity
              style={[styles.submitButton, passed && { backgroundColor: 'green' }]}
              onPress={passed ? handleWithdrawalRequests : handleWithdrawalRequest}
            >
              <Text style={styles.submitButtonText}>
                {passed ? 'Proceed to Withdraw' : 'Submit Request'}
              </Text>
            </TouchableOpacity>
          </>
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
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Plus Jakarta Sans Bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#666',
    marginBottom: 8,
    marginTop: 21,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 13,
    color: '#666',
  },
  dropdown: {
    borderColor: '#66666665',
    borderWidth: 0.6,
    padding: 16,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#121212',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  dropdownItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  dropdownSelectedText: {
    fontSize: 13,
    color: '#121212',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  accountName: {
    fontFamily: 'Plus Jakarta Sans Bold',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#515FDF',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
  },
});

export default RequestWithdrawal;
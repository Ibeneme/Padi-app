import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
  import { useNavigation } from '@react-navigation/native';
  import { useDispatch } from 'react-redux';
  import { getTransactions, getWallet } from '../../Redux/Wallet/CreateWallet';
  import Clipboard from '@react-native-clipboard/clipboard'; // Updated import
  
  const transactionsPlaceholder = [
    {
      status: 'Successful',
      type: 'Credit',
      purpose: 'Salary',
      recipient: 'John Doe',
      time: '10:00 AM',
      date: '2024-07-01',
    },
    {
      status: 'Successful',
      type: 'Debit',
      purpose: 'Grocery Shopping',
      recipient: 'Supermarket',
      time: '02:00 PM',
      date: '2024-07-02',
    },
    {
      status: 'Successful',
      type: 'Credit',
      purpose: 'Freelance Work',
      recipient: 'Jane Smith',
      time: '11:30 AM',
      date: '2024-07-03',
    },
  ];
  
  const Wallet = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
  
    useEffect(() => {
      dispatch(getWallet())
        .then(response => {
          console.log(response?.payload, 'Wallet Details');
          setWallet(response?.payload);
        })
        .catch(error => {
          console.error(error);
        });
    }, [dispatch]);
  
    useEffect(() => {
      dispatch(getTransactions())
        .then(response => {
          console.log(response?.payload, 'Transactions');
          setTransactions(response?.payload?.data || []);
        })
        .catch(error => {
          console.error(error);
        });
    }, [dispatch]);
  
    const copyToClipboard = text => {
      Clipboard.setString(text);
      Alert.alert('Copied to Clipboard', 'Account number copied successfully!');
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ padding: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>
  
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.dashboard, { marginTop: 48 }]}>
              <View>
                <Text style={[styles.balanceText, { fontSize: 14 }]}>Balance</Text>
                <Text style={[styles.balanceText, { fontSize: 24, marginTop: -8 }]}>
                  $5,000
                </Text>
              </View>
              <TouchableOpacity style={styles.withdrawButton}>
                <Text style={styles.withdrawButtonText}>Withdraw</Text>
              </TouchableOpacity>
  
              {wallet && (
                <View style={styles.walletDetails}>
                  <TouchableOpacity onPress={() => copyToClipboard(wallet.account_number)}>
                    <Text style={[styles.walletDetailText, styles.boldText]}>
                      Account Number: {wallet.account_number}
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.walletDetailText, styles.boldText]}>
                    Bank Name: {wallet.bank.name}
                  </Text>
                  <Text style={styles.walletDetailText}>
                    Account Name: {wallet.bank.account_name}
                  </Text>
                  <Text style={styles.walletDetailText}>
                    First Name: {wallet.customer.first_name}
                  </Text>
                  <Text style={styles.walletDetailText}>
                    Last Name: {wallet.customer.last_name}
                  </Text>
                </View>
              )}
            </View>
  
            {transactions.length === 0 ? (
              <View>
                <Text style={styles.noTransactionsText}>
                  No Transactions Yet
                </Text>
              </View>
            ) : (
              <FlatList
                data={transactions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.transactionItem}>
                    <View style={styles.transactionStatus}>
                      <Text style={styles.transactionStatusText}>
                        Status: {item.status}
                      </Text>
                    </View>
                    <Text style={[styles.transactionText, styles.lightText]}>
                      Type: {item.type}
                    </Text>
                    <Text style={styles.transactionText}>
                      Purpose: {item.purpose}
                    </Text>
                    <Text style={styles.transactionText}>
                      Recipient: {item.recipient}
                    </Text>
                    <Text style={styles.transactionText}>Time: {item.time}</Text>
                    <Text style={styles.transactionText}>Date: {item.date}</Text>
                  </View>
                )}
              />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };
  
  export default Wallet;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f4f4f4',
    },
    dashboard: {
      backgroundColor: '#515FDF',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    balanceText: {
      fontFamily: 'Plus Jakarta Sans Bold',
      fontSize: 20,
      color: '#ffffff',
      marginBottom: 12,
    },
    withdrawButton: {
      backgroundColor: '#ffffff',
      padding: 12,
      borderRadius: 32,
      alignItems: 'center',
      marginTop: 32,
    },
    withdrawButtonText: {
      fontFamily: 'Plus Jakarta Sans Bold',
      fontSize: 16,
      color: '#515FDF',
    },
    walletDetails: {
      marginTop: 24,
      padding: 16,
      backgroundColor: '#ffffff18',
      borderRadius: 12,
    },
    walletDetailText: {
      fontFamily: 'Plus Jakarta Sans Regular',
      fontSize: 14,
      color: '#fff',
      marginBottom: 8,
    },
    boldText: {
      fontFamily: 'Plus Jakarta Sans Bold',
    },
    noTransactionsText: {
      fontSize: 14,
      color: '#666',
      padding: 16,
      fontFamily: 'Plus Jakarta Sans',
    },
    transactionItem: {
      backgroundColor: '#ffffff',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    transactionStatus: {
      borderRadius: 24,
      backgroundColor: '#515FDF16',
      alignSelf: 'flex-start',
      marginBottom: 12,
    },
    transactionStatusText: {
      color: '#515FDF',
      padding: 12,
    },
    transactionText: {
      fontFamily: 'Plus Jakarta Sans Regular',
      color: '#666',
      fontSize: 13,
    },
    lightText: {
      fontSize: 14,
    },
  });
  
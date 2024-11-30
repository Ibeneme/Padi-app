import React, {useState} from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';

const PaystackPayment = ({publicKey, amount, email}) => {
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const startPayment = () => {
    const url = `https://checkout.paystack.com/${publicKey}?amount=${amount}&email=${email}`;
    setPaymentUrl(url); // Set the WebView URL
    setWebViewVisible(true); // Show the WebView
  };

  const handleWebViewNavigation = (event) => {
    if (event.url.includes('success')) {
      setWebViewVisible(false);
      alert('Payment successful!');
    } else if (event.url.includes('failure')) {
      setWebViewVisible(false);
      alert('Payment failed!');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={startPayment} style={styles.payButton}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>

      {webViewVisible && (
        <Modal
          visible={webViewVisible}
          animationType="slide"
          onRequestClose={() => setWebViewVisible(false)}>
          <SafeAreaView style={styles.webViewContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWebViewVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <WebView
              source={{uri: paymentUrl}}
              onNavigationStateChange={handleWebViewNavigation}
              style={styles.webView}
            />
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButton: {
    padding: 15,
    backgroundColor: '#515FDF',
    borderRadius: 8,
  },
  payButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  webViewContainer: {
    flex: 1,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#FF0000',
    alignSelf: 'flex-end',
    margin: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
});

export default PaystackPayment;
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewComponent: React.FC = () => {
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(true); // Make the modal visible by default
  const [isWebViewVisible, setWebViewVisible] = useState(false); // WebView modal visibility state

  useEffect(() => {
    // Automatically show the confirmation modal when the component mounts
    setConfirmModalVisible(true);
  }, []);

  const closeConfirmModal = () => {
    setConfirmModalVisible(false);
  };

  const openWebView = () => {
    setConfirmModalVisible(false); // Close the confirm modal
    setWebViewVisible(true); // Open the WebView modal
  };

  const closeWebView = () => {
    setWebViewVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Confirmation Modal */}
 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  confirmModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#fff',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#fff',
  },
  webViewContainer: {
    flex: 1,
  },
  closeButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#515FDF',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#fff',
  },
});

export default WebViewComponent;
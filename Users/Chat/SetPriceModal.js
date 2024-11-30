import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios'; // Import axios
import {useDispatch} from 'react-redux'; // Import useDispatch
import {setRidePrice} from '../../Redux/Users/User'; // Assuming you use Redux for price
import {NEW_BASE_URL} from '../../Redux/NewBaseurl/NewBaseurl';

const SetPriceModal = ({visible, onClose, chatID, onPriceSet}) => {
  const [price, setPriceInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSave = () => {
    setIsLoading(true);

    const payload = {
      chatID: chatID,
      price: parseFloat(price),
    };

    axios
      .post(`${NEW_BASE_URL}/api/set-price`, payload)
      .then(response => {
        if (response.data?.success === true) {
          console.log('Price set successfully:', response.data);

          // Trigger callback to notify parent about the update
          if (onPriceSet) {
            onPriceSet();
          }

          onClose(); // Close the modal
        } else {
          alert('Failed to set price. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error setting price:', error);
        alert('Failed to set price. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Set a Price for the Ride</Text>
          <Text style={styles.disclaimer}>
            Disclaimer: Once a price is set, you cannot update it.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPriceInput}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.ctaButton, isLoading && styles.disabledButton]}
            onPress={handleSave}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.ctaButtonText}>Set Price</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Darkened background
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Plus Jakarta Sans Bold',
    marginBottom: 16,
    color: '#333',
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  ctaButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#515FDF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6, // Visual indication that button is disabled
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#fff',
  },
  cancelButton: {
    marginTop: 8,
    padding: 12,
    width: '100%',
    height: 50,
    backgroundColor: '#515FDF20',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#515FDF',
  },
});

export default SetPriceModal;

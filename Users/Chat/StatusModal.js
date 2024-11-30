import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import RatingIcon from './RatingIcon/RatingIcon'; // Empty star
import RatingFullIcon from './RatingIcon/RatingIconFull'; // Filled star

const StatusModal = ({
  visible,
  onClose,
  status,
  onConfirm,
  isLoading,
  isSuccess,
}) => {
  const [rating, setRating] = useState(0);

  let header = '';
  let message = '';
  let actionText = '';

  switch (status) {
    // ... other case statements

    case 'rateRide':
      header = 'Rate Ride';
      message = 'Please rate your ride experience.';
      actionText = 'Submit Rating';
      break;
    default:
      header = 'Notice';
      message = 'No action specified.';
      actionText = 'Close';
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          ) : isSuccess ? (
            <View style={styles.successContainer}>
              <Text style={styles.successHeader}>Success!</Text>
              <Text style={styles.successMessage}>
                Your action was successful.
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : status === 'rateRide' ? (
            <>
              <Text style={styles.modalHeaderText}>{header}</Text>
              <Text style={styles.modalText}>{message}</Text>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    {rating >= star ? (
                      <RatingFullIcon width={48} height={48} />
                    ) : (
                      <RatingIcon width={48} height={48} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => {
                  console.log(`Rating submitted: ${rating}`);
                  onConfirm(rating); // Pass rating to the parent component
                 // onClose(); // Close the modal after submission
                }}
                style={styles.confirmButton}>
                <Text style={styles.buttonText}>Submit Rating</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalHeaderText}>{header}</Text>
              <Text style={styles.modalText}>{message}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={onConfirm}
                  style={styles.confirmButton}>
                  <Text style={styles.buttonText}>{actionText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  loadingContainer: {alignItems: 'center'},
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  successContainer: {alignItems: 'center'},
  successHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  successMessage: {fontSize: 16, color: '#4CAF50', marginBottom: 20},
  modalHeaderText: {
    fontSize: 17,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans Bold',
    color: '#000',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 48,
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 36,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 36,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 36,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 2,
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default StatusModal;

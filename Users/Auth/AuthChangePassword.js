import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {confirmChangePassword, passwordReset} from '../../Redux/Auth/Auth';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const AuthChangePassword = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [focusedInput, setFocusedInput] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const route = useRoute();
  const {phone_number, otp} = route.params;

  console.log(`Phone Number: ${phone_number}, OTP: ${otp}`);

  const handleSubmit = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setNotification('');

    dispatch(
      passwordReset({phone_number,new_password: newPassword}),
    )
      .then(response => {
        setLoading(false);
        if (response.payload?.success === true) {
          setNotification('Password changed successfully.');
          navigation.navigate('SignIn');
        } else {
          setError(response.payload?.message || 'Error changing password.');
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Something went wrong. Please try again.');
      });
  };

  const handleInputChange = (setter, value) => {
    setter(value);
    setError('');
    setNotification('');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>

          <Text style={styles.textBold}>Change Your Password</Text>

          <View style={styles.viewForInputs}>
            {error ? (
              <Text style={[styles.errorText, {backgroundColor: '#ff000025'}]}>
                {error}
              </Text>
            ) : null}
            {notification ? (
              <Text
                style={[
                  styles.errorText,
                  {backgroundColor: '#515FDF25', color: '#515FDF'},
                ]}>
                {notification}
              </Text>
            ) : null}

            <View>
              <Text style={styles.text}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'newPassword' && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedInput('newPassword')}
                  onBlur={() => setFocusedInput(null)}
                  value={newPassword}
                  onChangeText={value =>
                    handleInputChange(setNewPassword, value)
                  }
                  placeholder="Enter new password"
                  placeholderTextColor="#666666"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  style={styles.showHideButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Text style={styles.showHideText}>
                    {showNewPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginTop: 32}}>
              <Text style={styles.text}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'confirmPassword' && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                  value={confirmPassword}
                  onChangeText={value =>
                    handleInputChange(setConfirmPassword, value)
                  }
                  placeholder="Confirm new password"
                  placeholderTextColor="#666666"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.showHideButton}
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }>
                  <Text style={styles.showHideText}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator color="#fff" /> : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  textBold: {
    fontFamily: 'Plus Jakarta Sans Bold',
    fontSize: 20,
    color: '#515FDF',
    marginTop: 48,
  },
  text: {
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  viewForInputs: {
    marginTop: 32,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#66666650',
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: '#000000',
    marginTop: 4,
  },
  inputFocused: {
    borderColor: '#515FDF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  showHideButton: {
    marginLeft: 8,
  },
  showHideText: {
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    color: '#515FDF',
  },
  errorText: {
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 12,
    color: '#ff0650',
    marginTop: 8,
    padding: 12,
  },
  button: {
    backgroundColor: '#515FDF',
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontFamily: 'Plus Jakarta Sans Bold',
    fontSize: 14,
    color: '#fff',
  },
});

export default AuthChangePassword;
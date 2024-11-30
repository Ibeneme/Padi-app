import React, {useState, useEffect} from 'react';
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
import {resendOTP, verifyOTP} from '../../Redux/Auth/Auth';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const AuthVerifyTwo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [focusedInput, setFocusedInput] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nots, setNotification] = useState('');
  const [countdown, setCountdown] = useState(0);

  const route = useRoute();
  const {phone_number, id} = route.params;

  const handleLogin = () => {
    if (!otp.trim()) {
      setOtpError('Please enter OTP');
      return;
    }

    setLoading(true);
    setError('');
    setNotification('');

    dispatch(verifyOTP({phoneNumber: phone_number, otp}))
      .then(response => {
        setLoading(false);
        console.log('OTP Verification successful:', response);
        if (response.payload?.success === true) {
          navigation.navigate('newpass', {phone_number, otp});
        }
        if (
          response?.payload?.request?._response ===
          `{"error":"Invalid or expired OTP"}`
        ) {
          setError('Invalid or expired OTP');
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('OTP Verification error:', error);
      });
  };

  const handleResendOTP = () => {
    if (countdown > 0) return; // Prevent resend if countdown is active

    setNotification('');
    setError('');
    setCountdown(60); // Start the countdown

    dispatch(resendOTP(phone_number))
      .then(response => {
        console.log('Resend OTP successful:', response);
        if (response.type === 'registration/resendOTP/fulfilled') {
          setNotification('OTP Resent successfully');
        }
      })
      .catch(error => {
        console.error('Resend OTP error:', error);
      });
  };

  // Countdown logic
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = otp => {
    setOtp(otp);
    setOtpError('');
    setError('');
    setNotification('');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Verify',
      headerStyle: {backgroundColor: '#ffffff'},
      headerTitleStyle: {color: '#000000', fontFamily: 'Regular'},
      headerTintColor: '#000000',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>

          <View>
            <Text style={styles.textBold}>Verify your account</Text>

            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={countdown > 0} // Disable button if countdown is active
            >
              <Text style={[styles.text, countdown > 0 && styles.textDisabled]}>
                {countdown > 0
                  ? `Resend OTP in ${countdown}s`
                  : <Text>Didn't get OTP?. Resend</Text>}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.viewForInputs}>
            {error ? (
              <Text style={[styles.errorText, {backgroundColor: '#ff000025'}]}>
                {error}
              </Text>
            ) : null}
            {nots ? (
              <Text
                style={[
                  styles.errorText,
                  {backgroundColor: '#515FDF25', color: '#515FDF'},
                ]}>
                {nots}
              </Text>
            ) : null}

            <View>
              <Text style={styles.text}>OTP</Text>
              <TextInput
                style={[
                  styles.input,
                  otpError && styles.inputError,
                  focusedInput === 'otp' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedInput('otp')}
                onBlur={() => setFocusedInput(null)}
                value={otp}
                onChangeText={handleOtpChange}
                placeholder="Enter OTP"
                placeholderTextColor="#666666"
                keyboardType="numeric"
                autoCapitalize="none"
              />
              {otpError ? (
                <Text style={styles.errorText}>{otpError}</Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
  textDisabled: {
    color: 'gray', // Gray color for countdown
  },
  textSpan: {
    color: '#515FDF',
  },
  viewForInputs: {
    marginTop: 32,
  },
  input: {
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
  inputError: {
    borderColor: 'red',
  },
  inputFocused: {
    borderColor: '#515FDF',
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

export default AuthVerifyTwo;
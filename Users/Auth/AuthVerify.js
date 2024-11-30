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
import {verifyOTP, resendOTP} from '../../Redux/Auth/Auth';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const AuthVerify = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [focusedInput, setFocusedInput] = useState(null);
  const [otp, setOTP] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [otpValid, setOTPValid] = useState(true); // State to track OTP validation

  const route = useRoute();
  const {phone_number, id} = route.params;
  console.log(phone_number, 'phone_number');
  const handleLogin = () => {
    if (!otp.trim()) {
      setOTPValid(false);
      return;
    }

    setLoading(true);
    setError('');
    setNotification('');
    setOTPValid(true); // Reset OTP validation state

    const otpData = {
      phone_number: phone_number,
      otp: otp,
    };

    dispatch(verifyOTP({phoneNumber: phone_number, otp: otp}))
      .then(response => {
        setLoading(false);
        console.log('OTP Verification successful:', response);
        if (response.payload?.success === true) {
          navigation.navigate('success');
        }
        if (
          response?.payload?.request?._response ===
          '{"error":"Invalid or expired OTP"}'
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
    setNotification('');
    setError('');

    const otpData = {
      phone_number: phone_number,
      id: id,
    };

    dispatch(resendOTP(otpData))
      .then(response => {
        console.log('Resend OTP successful:', response);
        if (response.type === 'registration/resendOTP/fulfilled') {
          setNotification('OTP Resent successfully');
        }
      })
      .catch(error => {
        console.log('Resend OTP error:', error);
      });
  };

  const handleOTPChange = otp => {
    setOTP(otp);
    setOTPValid(true); // Reset OTP validation state
    setError('');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Verify',
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      headerTitleStyle: {
        fontFamily: 'Plus Jakarta Sans Regular',
        color: '#000000',
        borderBottomWidth: 0,
      },
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

            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.text}>
                Didn't get OTP <Text style={styles.textSpan}>Resend</Text>
              </Text>
            </TouchableOpacity>
          </View>

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
              <Text style={styles.text}>OTP</Text>
              <TextInput
                style={[
                  styles.input,
                  !otpValid && styles.inputError, // Apply error style if OTP is not valid
                  focusedInput === 'OTP' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedInput('OTP')}
                onBlur={() => setFocusedInput(null)}
                value={otp}
                onChangeText={handleOTPChange}
                placeholder="Enter OTP"
                placeholderTextColor="#666666"
                keyboardType="numeric"
              />
              {!otpValid && (
                <Text style={styles.errorText}>Please enter OTP</Text>
              )}
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

export default AuthVerify;

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
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {forgotPassword} from '../../Redux/Auth/Auth';
import {useDispatch} from 'react-redux';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
//import ArrowLeftSVG from './ArrowLeftSVG';

const AuthForgotPassword = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [phone_number, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    if (emailError) {
      setLoading(false);
      setError('Incorrect entries.');
      return; // Do not proceed with registration if there are errors
    }
    if (!phone_number) {
      setError('Please fill in all input fields.');
      setLoading(false);
      return;
    }

    // const loginData = {
    //   phone_number: phone_number,
    // };

    dispatch(forgotPassword(phone_number))
      .then(response => {
        setLoading(false);
        console.log(
          'forgotPasswordforgotPassword successful:',
          response.payload,
        );
        if (response.payload?.success === true) {
          navigation.navigate('AuthVerifyTwo', {
            phone_number: phone_number,
          });
        } else if (
          response.payload?.message === 'User with this phone number not found.'
        ) {
          setError('User with this phone number not found.');
        } else {
          setError('An error Occurred');
        }
        // navigation.navigate("success")
        // Handle successful login here
      })
      .catch(error => {
        setLoading(false);
        console.log('Login error:', error);
        // Handle login error here
      });
  };

  const handleEmailChange = phone_number => {
    setEmail(phone_number);
  };

  const handlePasswordChange = password => {
    setError('');
    setPasswordError('');
    setPassword(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const headerStyle = {
    backgroundColor: '#ffffff',
  };

  const headerTitleStyle = {
    color: '#000000',
    borderBottomWidth: 0,
  };

  const headerTintColor = '#000000';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Forgot Password',
      headerLeft: () => <View></View>,
      headerStyle,
      headerTitleStyle: {
        fontFamily: 'Plus Jakarta Sans Regular',
      },
      headerTintColor,
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <ScrollView style={{flexGrow: 1}}>
        <View style={[styles.containerfirst, {}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.textBold}>Forgot Password</Text>
            <Text
              style={styles.text}
              onPress={() => navigation.navigate('createAccount')}>
              Don't have an Account?{' '}
              <Text style={styles.textSpan}>Create an Account</Text>
            </Text>
          </View>

          <View style={styles.viewForInputs}>
            {error ? (
              <Text
                style={[
                  styles.errorText,
                  {backgroundColor: '#ff000025', padding: 12},
                ]}>
                {error}
              </Text>
            ) : null}

            <View>
              <Text style={styles.text}>Phone Number</Text>
              <TextInput
                style={[
                  styles.input,
                  emailError && {borderColor: 'red'},
                  focusedInput === 'phone_number' && {borderColor: '#515FDF'},
                ]}
                onFocus={() => setFocusedInput('phone_number')}
                onBlur={() => setFocusedInput(null)}
                value={phone_number}
                onChangeText={handleEmailChange}
                placeholder="Enter Phone Number"
                placeholderTextColor={`${'#000000'}60`}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.buttonClick} onPress={handleLogin}>
              <Text
                style={[
                  styles.buttonText,
                  {fontFamily: 'Plus Jakarta Sans Bold', color: '#fff'},
                ]}>
                {loading ? <ActivityIndicator color="#fff" /> : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthForgotPassword;

const styles = StyleSheet.create({
  input: {
    borderWidth: 0.3,
    borderColor: '#666666',
    color: '#666',
    padding: 10,
    borderRadius: 6,
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    height: 55,
    marginTop: 4,
    width: '100%',
  },
  errorText: {
    color: '#ff0650',
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  forgotPassword: {
    color: '#000000',
    marginTop: -12,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  passwordtext: {
    textAlign: 'right',
    marginTop: 12,
    color: '#000000',
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 12,
  },
  buttonClick: {
    backgroundColor: '#515FDF',
    width: '100%',
    height: 55,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 64,
  },
  buttonClickLoading: {
    backgroundColor: '#515FDF45',
    width: '100%',
    height: 50,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  passwordVisibilityIcon: {
    position: 'absolute',
    bottom: '10%',
    right: 0,
    padding: 10,
    color: '#000000',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  containerfirst: {
    color: '#ffffff',
    height: '100%',
    padding: 16,
  },
  text: {
    color: '#000000',
    marginTop: 4,
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
  },
  textBold: {
    color: '#515FDF',
    fontFamily: 'Plus Jakarta Sans Bold',
    fontSize: 20,
    marginTop: 48,
  },
  textSpan: {
    color: '#515FDF',
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    paddingLeft: 8,
  },
  viewForInputs: {
    marginTop: 48,
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 72,
  },
});

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
import Icon from 'react-native-vector-icons/FontAwesome';
import {registerUser} from '../../Redux/Auth/Auth';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';

const AuthCreateAccount = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCodeError, setReferralCodeError] = useState('');

  const handleFirstNameChange = firstName => {
    setError('');
    setFirstNameError('');
    const formattedName = firstName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    setFirstName(formattedName);
  };

  const handleLastNameChange = lastName => {
    setError('');
    setLastNameError('');
    const formattedName = lastName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    setLastName(formattedName);
  };

  const handlePhoneNumberChange = phoneNumber => {
    setError('');
    setPhoneNumberError('');
    setPhoneNumber(phoneNumber);
    const phoneNumberPattern = /^\d+$/;
    if (!phoneNumberPattern.test(phoneNumber)) {
      setPhoneNumberError('Phone number should contain only numbers.');
    } else if (phoneNumber.length < 11) {
      setPhoneNumberError(
        'Phone number should contain a minimum of 11 digits.',
      );
    } else {
      setPhoneNumber(phoneNumber);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create an Account',
      headerLeft: () => <View></View>,
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      headerTitleStyle: {
        fontFamily: 'Regular',
        color: '#000000',
      },
      headerTintColor: '#000000',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  const handleLogin = () => {
    setLoading(true);
    if (
      phoneNumberError ||
      passwordError ||
      firstNameError ||
      lastNameError ||
      emailError ||
      confirmPasswordError
    ) {
      setLoading(false);
      console.log('Registration has errors. Please fix the errors.');
      return;
    }
    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all input fields.');
      setLoading(false);
      return;
    }
    const userData = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      password: password,
      password2: confirmPassword,
      referral_code: referralCode ? referralCode : null, // Add referral code here
    };

    setLoading(true);
    console.log(userData, 'userData');

    dispatch(registerUser(userData))
      .then(response => {
        setLoading(false);
        console.log('Registration successful:', response?.payload);

        const id = response?.payload?.data?.id;
        console.log(response.payload, 'response.payload.success');
        if (response.payload.success === true) {
          // Navigate to the verification screen if registration is successful
          navigation.navigate('verify', {phone_number: phoneNumber});
        } else {
          console.log('User with this email or phone number already exists.');
          setError('User with this email or phone number already exists.');
        }

        // Handle other specific response payloads if needed
        // This could be further customized depending on API response structure
      })
      .catch(error => {
        setLoading(false);

        // More specific error handling
        if (error?.response?.status === 400) {
          setError('User with this email or phone number already exists.');
        } else {
          setError('Cannot Register a User at the moment');
        }

        console.log('Registration error:', error.message);
      });
  };

  const handleEmailChange = email => {
    setEmailError('');
    const formattedEmail = email
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
    setEmail(formattedEmail);
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isValidEmail = emailPattern.test(formattedEmail);
    setEmailError(
      isValidEmail
        ? ''
        : `Please Enter a Valid Email address, Hint: "Example@mail.com"`,
    );
  };

  const handlePasswordChange = newPassword => {
    setPasswordError('');
    setPassword(newPassword);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long',
      );
    }
  };

  const handleConfirmPasswordChange = confirmPassword => {
    setConfirmPasswordError('');
    setConfirmPassword(confirmPassword);
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    setConfirmPassword(confirmPassword);
  };

  const handleReferralCodeChange = code => {
    setReferralCodeError('');
    setReferralCode(code);

    // Optional: Basic validation
    if (code.length > 10) {
      setReferralCodeError('Referral code cannot exceed 10 characters.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: '#fff'}]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.container, {margin: 16, backgroundColor: '#fff'}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftSVG width={16} height={16} color="#515FDF" />
          </TouchableOpacity>

          <View style={{}}>
            <Text style={styles.textBold}>Welcome</Text>
            <Text
              style={styles.text}
              onPress={() => navigation.navigate('SignIn')}>
              Already have an Account?{' '}
              <Text style={styles.textSpan}>Login</Text>
            </Text>
          </View>

          <View style={styles.viewForInputs}>
            {error ? (
              <Text style={styles.errorTextWithBackground}>{error}</Text>
            ) : null}

            <View>
              <Text style={styles.text}>First Name</Text>
              <TextInput
                style={[
                  styles.input,
                  firstNameError && styles.inputError,
                  focusedInput === 'firstName' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedInput('firstName')}
                onBlur={() => setFocusedInput(null)}
                value={firstName}
                onChangeText={handleFirstNameChange}
                placeholder="Enter First Name"
                placeholderTextColor={`${'#000000'}60`}
              />
              {firstNameError ? (
                <Text style={styles.errorText}>{firstNameError}</Text>
              ) : null}
            </View>

            <View>
              <Text style={styles.text}>Last Name</Text>
              <TextInput
                style={[
                  styles.input,
                  lastNameError && styles.inputError,
                  focusedInput === 'lastName' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedInput('lastName')}
                onBlur={() => setFocusedInput(null)}
                value={lastName}
                onChangeText={handleLastNameChange}
                placeholder="Enter Last Name"
                placeholderTextColor={`${'#000000'}60`}
              />
              {lastNameError ? (
                <Text style={styles.errorText}>{lastNameError}</Text>
              ) : null}
            </View>

            <View>
              <Text style={styles.text}>Email Address</Text>
              <TextInput
                style={[
                  styles.input,
                  emailError && styles.inputError,
                  focusedInput === 'email' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Enter Email Address"
                keyboardType="email-address"
                placeholderTextColor={`${'#000000'}60`}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View>
              <Text style={styles.text}>Phone Number</Text>
              <TextInput
                style={[
                  styles.input,
                  phoneNumberError && styles.inputError,
                  focusedInput === 'phoneNumber' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedInput('phoneNumber')}
                onBlur={() => setFocusedInput(null)}
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                placeholder="Enter Phone Number"
                placeholderTextColor={`${'#000000'}60`}
                keyboardType="phone-pad"
              />
              {phoneNumberError ? (
                <Text style={styles.errorText}>{phoneNumberError}</Text>
              ) : null}
            </View>

            <View>
              <Text style={styles.text}>Referral Code (Optional)</Text>
              <TextInput
                style={[
                  styles.input,
                  referralCodeError && styles.inputError,
                  focusedInput === 'referralCode' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedInput('referralCode')}
                onBlur={() => setFocusedInput(null)}
                value={referralCode}
                onChangeText={handleReferralCodeChange}
                placeholder="Enter Referral Code"
                placeholderTextColor={`${'#000000'}60`}
              />
              {referralCodeError ? (
                <Text style={styles.errorText}>{referralCodeError}</Text>
              ) : null}
            </View>

            <View>
              <Text style={styles.text}>Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    passwordError && styles.inputError,
                    focusedInput === 'password' && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="Enter Password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor={`${'#000000'}60`}
                />

                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Text style={styles.passwordVisibilityText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View>
              <Text style={styles.text}>Confirm Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    confirmPasswordError && styles.inputError,
                    focusedInput === 'confirmPassword' && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  placeholder="Enter Password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor={`${'#000000'}60`}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Text style={styles.passwordVisibilityText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
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
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  'Create Account'
                )}
              </Text>
            </TouchableOpacity>

            {error ? (
              <Text style={styles.errorTextWithBackground}>{error}</Text>
            ) : null}
            <View style={{marginBottom: 64}}></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  errorTextWithBackground: {
    backgroundColor: '#ff000016',
    color: '#ff0000',
    fontFamily: 'Plus Jakarta Sans Regular',
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#ff0650',
    marginTop: 4,
    fontSize: 12,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Plus Jakarta Sans Regular',
  },
  passwordVisibilityText: {
    position: 'absolute',
    right: 0,
    padding: 10,
    color: '#515FDF',
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    top: -14,
  },
});

export default AuthCreateAccount;

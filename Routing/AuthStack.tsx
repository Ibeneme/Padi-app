import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Auth from '../Users/Auth/Auth';
import AuthSignIn from '../Users/Auth/AuthSignIn';
import AuthCreateAccount from '../Users/Auth/AuthCreateAccount';
import AuthForgotPassword from '../Users/Auth/AuthForgotPassword';
import AuthVerify from '../Users/Auth/AuthVerify';
import AuthSuccess from '../Users/Auth/AuthSuccess';
import AuthVerifyTwo from '../Users/Auth/AuthVerifyTwo';
import AuthSignInNew from '../Users/Auth/CreateAccount';
import OnboardingOne from '../Users/Onboarding/Onboarding';
import OnboardingTwo from '../Users/Onboarding/OnboardingOne';
import AuthChangePassword from '../Users/Auth/AuthChangePassword';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="welcome"
        options={{ headerShown: false }}
        component={Welcome}
      /> */}

      {/* 
      <Stack.Screen
        name="Onboarding"
        options={{ headerShown: false }}
        component={OnboardingOne}
      /> */}
      {/* <Stack.Screen
        name="OnboardingTwo"
        options={{headerShown: false}}
        component={OnboardingTwo}
      /> */}

      <Stack.Screen
        name="Auth"
        options={{headerShown: false}}
        component={Auth}
      />
      <Stack.Screen
        name="SignIn"
        options={{headerShown: false}}
        component={AuthSignIn}
      />
      <Stack.Screen
        name="createAccount"
        options={{headerShown: false}}
        component={AuthCreateAccount}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{headerShown: false}}
        component={AuthForgotPassword}
      />
      <Stack.Screen
        name="verify"
        options={{headerShown: false}}
        component={AuthVerify}
      />
      <Stack.Screen
        name="AuthVerifyTwo"
        options={{headerShown: false}}
        component={AuthVerifyTwo}
      />
      <Stack.Screen
        name="success"
        options={{headerShown: false}}
        component={AuthSuccess}
      />
      <Stack.Screen
        name="newpass"
        options={{headerShown: false}}
        component={AuthChangePassword}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;

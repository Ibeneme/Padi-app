import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyTabs from './BottomNavigation';
import CreatePost from '../Users/Components/CreatePost';
import CreateDelivery from '../Users/Deliver/CreateDelivery';
import DeliverySummary from '../Users/Deliver/DeliverySummary';
import DeliverySuccess from '../Users/Deliver/Success';
import CreateParcel from '../Users/Parcel/CreateParcel';
import DeliverySummaryParcel from '../Users/Parcel/DeliveryParcel';
import TravellersDetails from '../Users/Parcel/TravellersName';
import TravellersMessage from '../Users/Parcel/Message';
import ParcelPayment from '../Users/Parcel/Payment';
import Passenger from '../Users/Passenger/CreateDelivery';
import PassengerSummary from '../Users/Passenger/PassengerSummary';
import PassengerSuccess from '../Users/Passenger/Success';
import CreateRide from '../Users/JoinRide/Join';
import RideSummary from '../Users/JoinRide/JoinTwo';
import UpdateProfile from '../Users/User/UpdateProfile';
import CreateWallet from '../Users/Wallet/CreateWallet';
import LicenseInfoPage from '../Users/Wallet/VerifyLicense';
import RideSuccess from '../Users/JoinRide/RideSucccess';
import Wallet from '../Users/Wallet/Wallet';
import WalletSuccess from '../Users/Wallet/VerifySuccess';
import RequestList from '../Users/Menu/Request';
import GetDrivers from '../Users/Passenger/GetDrivers';
import SendersList from '../Users/Deliver/AllSendersList';
import PassengerLists from '../Users/Deliver/AllPassengers';
import Earnings from '../Users/Wallet/Earnings';
import Withdrawals from '../Users/Wallet/Withdrawals';
import Refunds from '../Users/Wallet/Refunds';
import EarningsDetail from '../Users/Wallet/EarningsDetail';
import Balance from '../Users/Wallet/Balance';
import BanksList from '../Users/Wallet/BanksList';
import RequestWithdrawal from '../Users/Wallet/RequestWithdrawal';
import TawkToChat from '../Users/Support/TawkChat';
import {Button, StyleSheet, Text, View} from 'react-native';
import ChatComponent from '../Users/Chat/ChatComponent';
import BecomeADriver from '../Users/User/BecomeDriver';
const Stack = createNativeStackNavigator();

function MyStack() {
  const SupportButton = ({navigation}: any) => {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to Support</Text>
        <Button
          title="Go to Support Chat"
          onPress={() => navigation.navigate('SupportChat')}
        />
      </View>
    );
  };

  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="welcome"
        options={{ headerShown: false }}
        component={Welcome}
      /> */}
      <Stack.Screen
        name="drawer"
        options={{headerShown: false}}
        component={MyTabs}
      />

      {/* Posts */}
      <Stack.Screen
        options={{headerShown: false}}
        name="createPost"
        component={CreatePost}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="BanksList"
        component={BanksList}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="TawkToChat"
        component={TawkToChat}
      />

      <Stack.Screen
        options={{headerShown: false}}
        name="Earnings"
        component={Earnings}
      />

      <Stack.Screen
        options={{headerShown: false}}
        name="Balance"
        component={Balance}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="RequestWithdrawal"
        component={RequestWithdrawal}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Withdrawals"
        component={Withdrawals}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Refunds"
        component={Refunds}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PassengerLists"
        component={PassengerLists}
      />

      <Stack.Screen
        options={{headerShown: false}}
        name="EarningsDetail"
        component={EarningsDetail}
      />

      {/* Delivery */}
      <Stack.Screen
        name="CreateDelivery"
        options={{headerShown: false}}
        component={CreateDelivery}
      />
      <Stack.Screen
        name="DeliverySummary"
        options={{headerShown: false}}
        component={DeliverySummary}
      />
      <Stack.Screen
        name="DeliverySuccess"
        options={{headerShown: false}}
        component={DeliverySuccess}
      />
      <Stack.Screen
        name="RideSuccess"
        options={{headerShown: false}}
        component={RideSuccess}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="CreateWallet"
        component={CreateWallet}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="walletscreen"
        component={Wallet}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="WalletSuccess"
        component={WalletSuccess}
      />
      {/* Parcel */}
      <Stack.Screen
        name="CreateParcel"
        options={{headerShown: false}}
        component={CreateParcel}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="DeliverySummaryParcel"
        component={DeliverySummaryParcel}
      />
      <Stack.Screen
        name="TravellersDetails"
        options={{headerShown: false}}
        component={TravellersDetails}
      />
      <Stack.Screen name="message" component={TravellersMessage} />
      <Stack.Screen name="payment" component={ParcelPayment} />
      <Stack.Screen
        name="BecomeADriver"
        options={{headerShown: false}}
        component={BecomeADriver}
      />
      <Stack.Screen
        name="updateprofile"
        component={UpdateProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen name="VerifyLicense" component={LicenseInfoPage} />
      {/* Parcel */}
      <Stack.Screen
        name="passengers"
        options={{headerShown: false}}
        component={Passenger}
      />
      <Stack.Screen
        name="PassengerSummary"
        options={{headerShown: false}}
        component={PassengerSummary}
      />
      <Stack.Screen name="PassengerSuccess" component={PassengerSuccess} />
      {/* Join a Ride */}
      <Stack.Screen
        name="CreateRide"
        options={{headerShown: false}}
        component={CreateRide}
      />
      <Stack.Screen
        name="RideSummary"
        options={{headerShown: false}}
        component={RideSummary}
      />
      <Stack.Screen
        name="RequestList"
        options={{headerShown: false}}
        component={RequestList}
      />
      <Stack.Screen
        name="GetDrivers"
        options={{headerShown: false}}
        component={GetDrivers}
      />
      <Stack.Screen
        name="SendersList"
        options={{headerShown: false}}
        component={SendersList}
      />

      <Stack.Screen
        name="ChatComponent"
        options={{headerShown: false}}
        component={ChatComponent}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default MyStack;

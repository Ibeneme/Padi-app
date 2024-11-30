import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './Routing/Stack';
// import { useFonts } from "expo-font";
import AuthStack from './Routing/AuthStack';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './Redux/Store';

const AppContent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.registration.user);
  console.log(user, 'statestate');


  return (
    <NavigationContainer>
    {!user ? <AuthStack /> : <MyStack />}
    </NavigationContainer>
  );
};

export default function App() {
  // const [loaded] = useFonts({
  //   Regular: require("./assets/fonts/PlusJakartaSans-Regular.ttf"),
  //   Bold: require("./assets/fonts/PlusJakartaSans-Bold.ttf"),
  //   Medium: require("./assets/fonts/PlusJakartaSans-Medium.ttf"),
  //   SemiBold: require("./assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  // });

  // if (!loaded) {
  //   return null;
  // }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import React, { useEffect } from 'react';
// import { StyleSheet, View } from 'react-native';
// import Featured from './feed/featured';
// import Following from './feed/following';
// import dummyData from '@helpers/dummy';
// import { colors } from '@config';

// type FeedScreenRouteParams = {
//   buttonType?: 'following' | 'featured';
// };

// const FeedScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { buttonType } = route.params as FeedScreenRouteParams || { buttonType: 'featured' };

//   useEffect(() => {
//     const checkAndNavigate = async () => {
//       const hasSeenPreferenceScreen = await AsyncStorage.getItem('hasSeenPreferenceScreen');

//       if (!hasSeenPreferenceScreen) {
//         navigation.navigate('Preferences');

//         await AsyncStorage.setItem('hasSeenPreferenceScreen', 'true');
//       }
//     };

//     checkAndNavigate();
//   }, [navigation]);
//   return (
//     <View style={s.container}>
//       {buttonType === 'following' ? <Following data={dummyData} /> : <Featured data={dummyData} />}
//     </View>
//   );
// };

// const s = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
// });

// export { FeedScreen };

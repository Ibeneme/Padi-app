import React from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import ArrowLeftSVG from '../Components/icons/ArrowLeftSvg';
import {useNavigation} from '@react-navigation/native';

const TawkToChat = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{padding: 16}}>
        <ArrowLeftSVG width={16} height={16} color="#515FDF" />
      </TouchableOpacity>
      <WebView
        source={{
          uri: 'https://tawk.to/chat/6748406a4304e3196ae9ccaf/1idp3n92p',
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default TawkToChat;

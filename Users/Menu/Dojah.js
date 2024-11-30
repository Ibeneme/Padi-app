import React, {useEffect} from 'react';
import Dojah from 'react-native-dojah-sdks';

const App = () => {
  const appID = '<YOUR_APP_ID>';
  const publicKey = '<YOUR_PUBLIC_KEY>';
  const widgetType = 'custom'; // Replace with your desired widget type
  const widgetConfig = {
    widget_id: '<YOUR_WIDGET_ID>',
    pages: [],
  };
  const userData = {
    first_name: 'John',
    dob: '1990-01-01',
  };
  const metadata = {
    user_id: '12345',
  };

  const handleResponse = (responseType, data) => {
    console.log('Response:', responseType, data);
  };

  useEffect(() => {
    Dojah.hydrate(appID, publicKey);
  }, [appID, publicKey]);

  return (
    <Dojah
      appID={appID}
      publicKey={publicKey}
      type={widgetType}
      userData={userData}
      metadata={metadata}
      config={widgetConfig}
      response={handleResponse}
      outerContainerStyle={{width: '100%', height: '100%'}}
    />
  );
};

export default App;

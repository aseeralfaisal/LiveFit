import * as React from 'react';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import TabScreen from './TabScreen';
import SignIn from './Components/SignIn';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  React.useEffect(() => {
    (async () => {
      const res = await AsyncStorage.getItem('token');
      res ? setLoggedIn(true) : setLoggedIn(false);
    })();
  });

  let [fontsLoaded] = useFonts({
    'Comfortaa-Regular': require('./assets/fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Medium': require('./assets/fonts/Comfortaa-Medium.ttf'),
    'Comfortaa-Bold': require('./assets/fonts/Comfortaa-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return loggedIn ? (
      <TabScreen loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    ) : (
      <SignIn loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    );
  }
}

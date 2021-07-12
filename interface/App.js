import * as React from 'react';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import TabScreen from './TabScreen';
import SignIn from './SignIn';
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
    'Comfortaa-Regular': require('./fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Medium': require('./fonts/Comfortaa-Medium.ttf'),
    'Comfortaa-Bold': require('./fonts/Comfortaa-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return loggedIn ? (
      <TabScreen />
    ) : (
      <SignIn loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    );
  }
}

import * as React from 'react';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import AppDrawer from './AppDrawer';
import TabScreen from './TabScreen';

export default function App() {
  let [fontsLoaded] = useFonts({
    'Comfortaa-Regular': require('./fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Medium': require('./fonts/Comfortaa-Medium.ttf'),
    'Comfortaa-Bold': require('./fonts/Comfortaa-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <TabScreen />;
  }
}

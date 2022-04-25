import * as React from 'react'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import TabScreen from './TabScreen'

export default function App() {

  let [fontsLoaded] = useFonts({
    'Comfortaa-Regular': require('./assets/fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Medium': require('./assets/fonts/Comfortaa-Medium.ttf'),
    'Comfortaa-Bold': require('./assets/fonts/Comfortaa-Bold.ttf'),
  })

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <TabScreen />
  }
}

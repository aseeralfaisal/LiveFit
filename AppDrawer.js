import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import WalkSteps from './WalkSteps';
import { useColorScheme } from 'react-native-appearance';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, Image } from 'react-native';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  let colorScheme = useColorScheme();
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContentOptions={{
          inactiveTintColor: 'gray',
          itemStyle: {
            marginVertical: 5,
          },
          activeTintColor: 'white',
          activeBackgroundColor: 'rgb(80,140,800)',
          labelStyle: {
            fontFamily: 'Comfortaa-Bold',
          },
        }}
        drawerStyle={{
          backgroundColor: colorScheme === 'dark' ? 'rgb(30, 30, 30)' : 'white',
        }}
        drawerType={'front'}
        initialRouteName={'Home'}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Walk Steps" component={WalkSteps} />
        <Drawer.Screen name="Demo" component={Demo} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 35,
    width: 35,
    marginHorizontal: 2,
    tintColor: 'white',
  },
});

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Components/Home';
import WalkSteps from './Components/WalkSteps';
import BMI from './Components/BMI';
import about from './Components/About';
import { useColorScheme } from 'react-native-appearance';
import { StyleSheet, Image, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabScreen({ setLoggedIn }) {
  const [steps, setSteps] = useState(0);

  let colorScheme = useColorScheme();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#FF8C53"
        barStyle={{ backgroundColor: 'rgb(50, 50, 50)' }}
        shifting={true}
        labeled={false}
      >
        <Tab.Screen
          name="Home"
          children={() => (
            <Home steps={steps} setSteps={setSteps} setLoggedIn={setLoggedIn} />
          )}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('./assets/icons/home.png')}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: color,
                }}
              />
            ),
            // tabBarColor: 'rgb(50,30,0)'
          }}
        />

        <Tab.Screen
          name="WalkSteps"
          children={() => <WalkSteps steps={steps} setSteps={setSteps} />}
          options={{
            tabBarLabel: 'WalkSteps',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('./assets/icons/walk.png')}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: color,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="BMI"
          component={BMI}
          options={{
            tabBarLabel: 'BMI',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('./assets/icons/weight_scale.png')}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: color,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="about"
          component={about}
          options={{
            tabBarLabel: 'BMI',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('./assets/icons/info.png')}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: color,
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import WalkSteps from './WalkSteps';
import BMI from './BMI';
import { useColorScheme } from 'react-native-appearance';
import { StyleSheet, Image, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabScreen() {
  const [steps, setSteps] = useState(0);

  let colorScheme = useColorScheme();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="rgb(80,190,800)"
        barStyle={{ backgroundColor: 'rgb(50, 50, 50)' }}
        shifting={true}
        labeled={false}
      >
        <Tab.Screen
          name="Home"
          children={() => <Home steps={steps} setSteps={setSteps} />}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('./icons/home.png')}
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
                source={require('./icons/walk.png')}
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
                source={require('./icons/weight_scale.png')}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: color,
                }}
              />
            ),
            // tabBarColor: 'rgb(80,140,800)',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

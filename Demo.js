import * as React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import Header from './Header';
import { useColorScheme } from 'react-native-appearance';

export default function Demo({ navigation }) {
  let colorScheme = useColorScheme();


  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'dark' ? 'rgb(30, 30, 30)' : 'rgb(30,30,30)',
      }}
    >
      <Header navigation={navigation} />
    </View>
  );
}

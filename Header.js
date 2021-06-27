import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native-appearance';

export default function Header({ navigation }) {
  let colorScheme = useColorScheme();
  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: '8.2%',
            marginHorizontal: 20,
          }}
        >
          <View>
            <Image
              source={require('./icons/LIVEFIT.png')}
              style={styles.logo}
            />
          </View>
          <TouchableOpacity>
            <Image
              source={require('./icons/user.png')}
              style={{
                height: 35,
                width: 35,
                marginHorizontal: 2,
                tintColor: colorScheme === 'dark' ? 'rgb(999,999,999)' : 'rgb(999,999,999)',
              }}
            />
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  logo: {
    // height: 200,
    width: 150,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginTop: -45,
  },
  text: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 22,
    color: '#1ABDFF',
  },
});

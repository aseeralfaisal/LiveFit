import * as React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native-appearance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn({ navigation, setLoggedIn }) {
  let colorScheme = useColorScheme();
  const [name, setName] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [status, setStatus] = React.useState('');

  const login = async () => {
    try {
      const URI = 'http://192.168.100.5:3001/api/login';
      const newUser = {
        name,
        pass,
      };
      const res = await axios.post(URI, newUser);
      if (res.status === 200) {
        const data = res.data;
        await AsyncStorage.setItem('token', data.token);
        // setLoggedIn(true);
      } else {
        setStatus('Wrong Username or Password');
      }
    } catch (err) {
      // console.log('Error');
      setStatus('Wrong Username or Password');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'dark' ? 'rgb(30, 30, 30)' : 'rgb(30,30,30)',
      }}
    >
      <View>
        <Image source={require('./icons/LIVEFIT.png')} style={styles.logo} />
      </View>
      <TextInput
        placeholder="Username"
        placeholderTextColor="lightgrey"
        onChangeText={(text) => setName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="lightgrey"
        onChangeText={(text) => setPass(text)}
        style={styles.input}
      />
      <TouchableOpacity style={styles.btn} onPress={login}>
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.btnText}>{status}</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 250,
    width: 250,
    resizeMode: 'contain',
    marginTop: 50,
    alignSelf: 'center',
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'rgb(70,80,90)',
    textAlign: 'center',
    textDecorationColor: 'white',
    fontSize: 18,
    fontFamily: 'Comfortaa-Bold',
    borderRadius: 20,
    padding: 10,
    color: 'white',
  },
  btn: {
    marginTop: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#1ABDFF',
    borderRadius: 20,
    padding: 10,
  },
  btnText: {
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 18,
  },
});

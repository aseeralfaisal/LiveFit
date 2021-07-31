import * as React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import Header from './Header';
import { useColorScheme } from 'react-native-appearance';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';
import uuid from 'uuid';
import { db, storage } from './Firebase';
import axios from 'axios';
import { Restart } from 'fiction-expo-restart';

export default function About({ navigation }) {
  let colorScheme = useColorScheme();
  const [loader, setLoader] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [img, setImg] = React.useState(null);

  const initLoad = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      setUser(username);
      db.collection('users')
        .doc(username)
        .onSnapshot((snap) => {
          setImg(snap.data().dpLink);
        });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    initLoad();
    return () => {
      initLoad();
    };
  }, []);

  const showImagePicker = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }
      setLoader(true);

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      const imgLink = await uploadImage(pickerResult.uri);
      db.collection('users').doc(user).set({
        dpLink: imgLink,
      });

      setImg(imgLink);
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  async function uploadImage(uri) {
    try {
      // https://github.com/expo/expo/issues/2402#issuecomment-443726662

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      // console.log(uri);
      const ref = storage.ref().child('img/' + user);
      const snapshot = await ref.put(blob);

      blob.close();

      return await snapshot.ref.getDownloadURL();
    } catch (err) {
      console.log('error occured');
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'dark' ? 'rgb(30, 30, 30)' : 'rgb(30,30,30)',
      }}
    >
      <Header navigation={navigation} />
      <View style={styles.profile}>
        <Image
          source={{ uri: img }}
          resizeMode={ImageResizeMode.contain}
          style={styles.logo}
        />
      </View>
      <Text style={styles.nameText}>{user}</Text>
      <TouchableOpacity
        style={styles.btnOpacity}
        onPress={showImagePicker}
        activeOpacity={0.6}
      >
        <Text style={styles.text}>Change Profile pic</Text>
      </TouchableOpacity>

      <View style={styles.activityIndicator}>
        <ActivityIndicator
          size={160}
          color="#FF8C53"
          style={{ display: loader ? 'flex' : 'none' }}
        />

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -660,
  },
  profile: {
    marginTop: -35,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 250,
  },
  btnOpacity: {
    marginHorizontal: 50,
    borderRadius: 50,
    backgroundColor: '#1ABDFF',
    padding: 10,
  },
  nameText: {
    fontSize: 40,
    textTransform: 'capitalize',
    color: '#1ABDFF',
    textAlign: 'center',
    fontFamily: 'Comfortaa-Bold',
    marginBottom: 25,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Comfortaa-Bold',
  },
});

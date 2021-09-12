import * as React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native-appearance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'
import { db, storage } from './Firebase'
import axios from 'axios'

import { AnimatedCircularProgress } from 'react-native-circular-progress'

export default function Header({ navigation, setLoggedIn }) {
  let colorScheme = useColorScheme()

  const [modal, setModal] = React.useState(false)

  const [user, setUser] = React.useState('')
  const [img, setImg] = React.useState(null)

  const initLoad = async () => {
    try {
      const username = await AsyncStorage.getItem('username')
      setUser(username)
      db.collection('users')
        .doc(username)
        .onSnapshot((snap) => {
          setImg(snap.data().dpLink)
        })
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    initLoad()
    return () => {
      initLoad()
    }
  }, [])

  const logout = async () => {
    setLoggedIn(false)
    await AsyncStorage.removeItem('token')
  }

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
          }}>
          <View>
            <Image source={require('../assets/icons/LIVEFIT-2.png')} style={styles.logo} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('about')}>
            <Image
              source={img ? { uri: img } : require('../assets/icons/user.png')}
              resizeMode={ImageResizeMode.contain}
              style={styles.log}
            />
          </TouchableOpacity>
        </View>

        <Modal
          animationType='fade'
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setModal(false)
          }}>
          <View
            style={{
              backgroundColor: 'rgba(30,30,30,0.85)',
              height: '100%',
              width: '100%',
            }}>
            <View style={styles.modal}>
              <TouchableOpacity style={styles.btn} onPress={logout}>
                <Text style={styles.btnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <StatusBar style='dark' />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  log: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  logo: {
    // height: 200,
    width: 150,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginTop: -45,
    overflow: 'hidden',
    shadowOffset: { width: 10, height: 10 },
    shadowColor: '#000',
    shadowOpacity: 1,
  },
  text: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 22,
    color: '#1ABDFF',
  },
  btn: {
    marginTop: 20,
    paddingVertical: 10,
    marginHorizontal: 25,
    backgroundColor: '#FF8C53',
    borderRadius: 20,
  },
  btnText: {
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 15,
    paddingHorizontal: 40,
  },
  modal: {
    alignItems: 'center',
    backgroundColor: 'rgb(10,10,10)',
    height: '80%',
    marginVertical: '16%',
    marginHorizontal: '10%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
})

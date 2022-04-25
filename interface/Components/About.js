import * as React from 'react'
import { StyleSheet, View, TextInput, Text, ActivityIndicator, Image, TouchableOpacity, Modal } from 'react-native'
import Header from './Header'
import { useColorScheme } from 'react-native-appearance'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'
import uuid from 'uuid'
import { db, storage } from './Firebase'
import { BlurView } from 'expo-blur'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

export default function About({ navigation }) {
  let colorScheme = useColorScheme()
  const [loader, setLoader] = React.useState(false)
  const [user, setUser] = React.useState('')
  const [img, setImg] = React.useState(null)
  const [modal, setModal] = React.useState(false)

  const [dailyGoal, setDailyGoal] = React.useState('')
  const [bodyweight, setBodyweight] = React.useState('')
  const [bodyfat, setBodyFat] = React.useState('')
  const [height, setHeight] = React.useState('')

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
    return () => initLoad()
  }, [])

  const getInfofromServer = async () => {
    const name = await AsyncStorage.getItem('username')
    const user = {
      name,
    }
    const out = await axios.post('https://livefitnodejs.herokuapp.com/api/getUserinfo', user)
    setDailyGoal(out.data.dailyGoal)
    setBodyweight(out.data.bodyweight)
    setBodyFat(out.data.bodyfat)
    setHeight(out.data.height)
    console.log(out.data)
  }

  React.useEffect(() => {
    getInfofromServer()
    return () => getInfofromServer()
  }, [])

  const showImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your photos!")
        return
      }
      setModal(false)
      setLoader(true)

      const pickerResult = await ImagePicker.launchImageLibraryAsync()

      const imgLink = await uploadImage(pickerResult.uri)
      db.collection('users').doc(user).set({
        dpLink: imgLink,
      })

      setImg(imgLink)
      setLoader(false)
    } catch (err) {
      console.log(err)
    }
  }

  async function uploadImage(uri) {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
          resolve(xhr.response)
        }
        xhr.onerror = function (e) {
          console.log(e)
          reject(new TypeError('Network request failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)
        xhr.send(null)
      })
      // console.log(uri);
      const ref = storage.ref().child('img/' + user)
      const snapshot = await ref.put(blob)

      blob.close()

      return await snapshot.ref.getDownloadURL()
    } catch (err) {
      console.log('error occured')
    }
  }

  const postInfo = async () => {
    const userInfo = {
      name: user,
      dailyGoal,
      bodyfat,
      bodyweight,
      height,
    }
    const out = await axios.post('https://livefitnodejs.herokuapp.com/api/userinfo', userInfo)
    console.log(out.data)
    setModal(false)
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <Header navigation={navigation} />
      <View style={styles.profile}>
        <Image source={{ uri: img }} resizeMode={ImageResizeMode.contain} style={styles.logo} />
      </View>
      <Text style={styles.nameText}>{user}</Text>

      <TouchableOpacity activeOpacity={0.7} style={styles.tile} onPress={() => setModal(true)}>
        <Image source={require('../assets/icons/edit.png')} style={styles.tileMenuIcon} />
        <Text style={styles.tileText}>Edit Info</Text>
      </TouchableOpacity>

      <View style={{ marginHorizontal: 60, alignSelf: 'center' }}>
        <View style={styles.infoIcons}>
          <Image source={require('../assets/icons/calories.png')} style={styles.InfoIconsOnly} />
          <Text style={styles.aboutInfoText}>Calorie goal: {dailyGoal}cal</Text>
        </View>

        <View style={styles.infoIcons}>
          <Image source={require('../assets/icons/weight.png')} style={styles.InfoIconsOnly} />
          <Text style={styles.aboutInfoText}>Bodyweight: {bodyweight}kg</Text>
        </View>

        <View style={styles.infoIcons}>
          <Image source={require('../assets/icons/body.png')} style={styles.InfoIconsOnly} />
          <Text style={styles.aboutInfoText}>BF Percentage: {bodyfat}</Text>
        </View>
        <View style={styles.infoIcons}>
          {/* <Image source={require('../assets/icons/height.png')} style={styles.InfoIconsOnly} /> */}
          <Text style={styles.aboutInfoText}>Height: {height}m</Text>
        </View>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false)
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '100%',
            height: '100%',
          }}>
          <View style={[styles.profile, { marginTop: 50 }]}>
            <Image source={{ uri: img }} resizeMode={ImageResizeMode.contain} style={styles.logo} />
          </View>
          <Text style={[styles.nameText, { marginTop: 50, marginBottom: -20 }]}>{user}</Text>
          <TouchableOpacity activeOpacity={0.7} style={[styles.tile, { marginTop: 40, marginBottom: -40 }]} onPress={showImagePicker}>
            <Image source={require('../assets/icons/user.png')} style={styles.tileMenuIcon} />
            <Text style={styles.tileText}>Change profile</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 60 }}>
            <TextInput
              placeholder='Daily calorie goal'
              placeholderTextColor='gray'
              value={dailyGoal}
              onChangeText={(text) => setDailyGoal(text)}
              style={styles.inputField}
            />
            <TextInput
              placeholder='Height'
              placeholderTextColor='gray'
              value={height}
              onChangeText={(text) => setHeight(text)}
              style={styles.inputField}
            />
            <TextInput
              placeholder='Bodyweight'
              placeholderTextColor='gray'
              value={bodyweight}
              onChangeText={(text) => setBodyweight(text)}
              style={styles.inputField}
            />
            <TextInput
              placeholder='Bodyfat'
              placeholderTextColor='gray'
              value={bodyfat}
              onChangeText={(text) => setBodyFat(text)}
              style={styles.inputField}
            />
          </View>

          <TouchableOpacity
            style={[styles.btnOpacity, { marginTop: 10, backgroundColor: 'rgb(80, 80, 80)' }]}
            onPress={postInfo}
            activeOpacity={0.6}>
            <Image source={require('../assets/icons/save.png')} style={{ height: 25, width: 25, marginHorizontal: 5 }} />
            <Text style={[styles.text, { marginHorizontal: 5 }]}>Save Info</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.activityIndicator}>
        <ActivityIndicator size={150} color='#29ABE2' style={{ display: loader ? 'flex' : 'none' }} />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  infoIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: 'rgba(80,80,80,0.3)',
    borderBottomWidth: 2,
  },
  InfoIconsOnly: {
    width: 35,
    height: 35,
    marginHorizontal: 5,
    tintColor: 'rgb(80,80,80)',
  },
  tile: {
    borderRadius: 25,
    backgroundColor: 'rgb(80,120,200)',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    width: 280,
    padding: 4,
    alignSelf: 'center',
  },
  tileText: {
    color: '#fff',
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 16,
  },
  tileMenuIcon: {
    height: 35,
    width: 35,
    marginHorizontal: 5,
  },
  inputField: {
    marginVertical: 10,
    color: 'rgba(80,80,80,0.85)',
    borderBottomWidth: 2,
    borderColor: 'rgba(80,80,80,0.3)',
    textAlign: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 18,
    height: 45,
    width: '70%',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'Comfortaa-Bold',
      },
      android: {
        fontFamily: 'Comfortaa-Bold',
      },
    }),
  },
  aboutInfoText: {
    marginVertical: 15,
    // alignSelf: 'flex-end',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 20,
    color: 'rgb(80,80,80)', //#FF8C53
  },
  modal: {
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.5)',
    height: '100%',
    width: '100%',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -940,
  },
  profile: {
    marginTop: -35,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    marginTop: -20,
    marginBottom: -20,
    width: 120,
    height: 120,
    borderRadius: 250,
  },
  btnOpacity: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 50,
    borderRadius: 50,
    backgroundColor: 'rgb(80,120,200)',
    padding: 8,
  },
  nameText: {
    marginTop: 25,
    fontSize: 30,
    textTransform: 'capitalize',
    color: 'rgb(80,120,200)',
    textAlign: 'center',
    fontFamily: 'Comfortaa-Bold',
    marginBottom: 25,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Comfortaa-Bold',
  },
})

import * as React from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native'
import Header from '../Components/Header'
import { useColorScheme } from 'react-native-appearance'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import MapView from 'react-native-maps'
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import * as icons from '@fortawesome/free-solid-svg-icons'

export default function About() {
  let colorScheme = useColorScheme()
  const navigation = useNavigation()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}
    >
      <Header />
      <Text style={{ color: '#000' }}>Hiii</Text>
    </View>
  )
}
const styles = StyleSheet.create({})

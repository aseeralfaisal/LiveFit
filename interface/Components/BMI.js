import * as React from 'react'
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image } from 'react-native'
import Header from './Header'
import { useColorScheme } from 'react-native-appearance'
import { useState } from 'react'
import { useEffect } from 'react'

export default function BMI({ navigation }) {
  let colorScheme = useColorScheme()

  const [bmi, setBMI] = useState(0)
  const [bodyweight, setBodyweight] = useState('')
  const [height, setHeight] = useState('')
  const [healthStatus, setHealthStatus] = useState('N/A')

  const calculateBmi = () => {
    let sum = bodyweight / (height * height)
    setBMI(sum)
    setBodyweight('')
    setHeight('')
  }

  useEffect(() => {
    if (bmi <= 18.5) {
      setHealthStatus('Underweight')
    } else if (bmi >= 18.6 && bmi <= 24.9) {
      setHealthStatus('Fit')
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      setHealthStatus('Overweight')
    } else if (bmi >= 30) {
      setHealthStatus('Obese')
    } else {
      setHealthStatus('n/a')
    }
  }, [calculateBmi])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <Header navigation={navigation} />
      <View style={styles.circleContainer}>
        <View>
          <Text style={styles.bmi}>{bmi.toFixed(1)}</Text>
        </View>
      </View>
      <TextInput
        value={height}
        onChangeText={(text) => setHeight(text)}
        style={styles.inputField}
        placeholder='Your Height (meters)'
        placeholderTextColor='rgb(150,150,150)'
        keyboardType='numeric'
      />
      <TextInput
        value={bodyweight}
        onChangeText={(text) => setBodyweight(text)}
        style={styles.inputField}
        placeholder='Your bodyweight (Kg)'
        placeholderTextColor='rgb(150,150,150)'
        keyboardType='numeric'
      />
      <TouchableOpacity style={styles.btn} onPress={calculateBmi}>
        <Text style={styles.btnText}>Calculate Mass Index</Text>
      </TouchableOpacity>

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginVertical: 40,
        }}>
        <Text style={styles.status}>{healthStatus}</Text>
        <Text style={styles.result}> for your height.</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 170,
  },
  bmi: {
    fontFamily: 'Comfortaa-Regular',
    fontSize: 70,
    color: '#1ABDFF',
    marginVertical: -160,
  },
  btn: {
    marginTop: 20,
    paddingVertical: 10,
    marginHorizontal: 60,
    backgroundColor: '#FF8C53',
    borderRadius: 20,
  },
  btnText: {
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 15,
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
  status: {
    color: '#FF8C53',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 40,
  },
  result: {
    color: 'rgb(80,80,80)',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 20,
  },
})

import * as React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native'
import { useState, useEffect } from 'react'
import { Pedometer } from 'expo-sensors'
import Header from './Header'
import { useColorScheme } from 'react-native-appearance'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

export default function WalkSteps({ navigation, steps, setSteps }) {
  let colorScheme = useColorScheme()
  // const [steps, setSteps] = useState(0);

  useEffect(() => {
    Pedometer.watchStepCount((PedometerResult) => setSteps(PedometerResult.steps))
    return () => {
      Pedometer.watchStepCount((PedometerResult) => setSteps(PedometerResult.steps)).remove()
    }
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <Header navigation={navigation} />
      <View style={styles.circleContainer}>
        <AnimatedCircularProgress
          size={250}
          width={15}
          fill={steps <= 5 ? 5 : steps}
          tintColor='#29ABE2'
          // onAnimationComplete={() => console.log('onAnimationComplete')}
          backgroundColor='rgba(80,80,80,0.3)'
          style={{
            marginVertical: -225,
          }}
        />
        <AnimatedCircularProgress
          size={200}
          width={10}
          fill={steps <= 5 ? 5 : steps}
          tintColor='#FF8C53'
          // onAnimationComplete={() => console.log('onAnimationComplete')}
          backgroundColor='rgba(80,80,80,0.3)'
        />
        <View>
          <Text style={styles.steps}>{steps}</Text>
        </View>
      </View>
      <View style={styles.walkTextParent}>
        <Image source={require('../assets/icons/walk.png')} style={{ tintColor: 'rgb(80,80,80)' }} />
        <Text style={styles.walkText}>Counting the steps</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // logo: {
  //   height: 35,
  //   width: 35,
  //   marginHorizontal: 2,
  // },
  text: {
    fontFamily: 'Comfortaa-Regular',
    fontSize: 22,
    color: '#1ABDFF',
  },
  walkText: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 22,
    color: '#29ABE2',
  },
  walkTextParent: {
    display: 'flex',
    alignItems: 'center',
    marginVertical: 60,
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  steps: {
    fontFamily: 'Comfortaa-Regular',
    fontSize: 80,
    color: '#1ABDFF',
    marginVertical: -170,
  },
})

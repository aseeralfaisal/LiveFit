import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Header from './Header'
import Menu from './Meals'
import { useColorScheme } from 'react-native-appearance'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import axios from 'axios'
import { Accelerometer } from 'expo-sensors'
import { startCounter, stopCounter } from 'react-native-accurate-step-counter'
// import { useSelector, useDispatch } from 'react-redux'
// import { setObj } from '../redux/actions'

export default function Home({ navigation, steps, setSteps, setLoggedIn }) {
  let colorScheme = useColorScheme()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Header navigation={navigation} setLoggedIn={setLoggedIn} />

      <View style={styles.twoTileView}>
        <TouchableOpacity activeOpacity={0.7} style={styles.tileView} onPress={() => navigation.navigate("FoodScan")}>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <View style={styles.roundbg}>
              <Image source={require('../assets/icons/food.png')} style={styles.circleIcon} />
            </View>
            <Text style={styles.tileText}>Meals</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.tileView} onPress={() => navigation.navigate("Workouts")}>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <View style={styles.roundbg}>
              <Image source={require('../assets/icons/workout.png')} style={styles.circleIcon} />
            </View>
            <Text style={styles.tileText}>Workout</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.twoTileView}>
        <TouchableOpacity activeOpacity={0.7} style={styles.tileView}>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <View style={styles.roundbg}>
              <Image source={require('../assets/icons/statistics.png')} style={styles.circleIcon} />
            </View>
            <Text style={styles.tileText}>Statistics</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.tileView}>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <View style={styles.roundbg}>
              <Image source={require('../assets/icons/tips.png')} style={styles.circleIcon} />
            </View>
            <Text style={styles.tileText}>Discover</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.twoTileView}>
        <TouchableOpacity activeOpacity={0.7} style={styles.tileView} onPress={() => navigation.navigate("BMI")}>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <View style={styles.roundbg}>
              <Image source={require('../assets/icons/massindex.png')} style={styles.circleIcon} />
            </View>
            <Text style={styles.tileText}>Mass Index</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.tileView}>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <View style={styles.roundbg}>
              <Image source={require('../assets/icons/walk.png')} style={styles.circleIcon} />
            </View>
            <Text style={styles.tileText}>Pedometer</Text>
          </View>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  twoTileView: {
    flexDirection: 'row', justifyContent: 'center'
  },
  tileView: {
    width: 140, borderRadius: 20, height: 165, margin: 12, backgroundColor: "#ecf4f7"
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tile: {
    borderRadius: 25,
    backgroundColor: 'rgb(80,120,200)',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 330,
  },
  tileText: {
    color: '#555',
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 18,
    marginTop: 14
  },
  tileMenuIcon: {
    height: 35,
    width: 35,
    marginHorizontal: 10,
  },
  roundbg: {
    backgroundColor: "#fff",
    borderRadius: 100,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14
  },
  circleTile: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderRadius: 15,
  },
  circleIcon: {
    // marginTop: 28,
    width: 55,
    height: 55,
    tintColor: 'rgb(100,100,100)', //rgb(41, 171, 226) //rgb(255, 140, 83)
  },
  stepsText: {
    color: 'rgb(80,80,80)',
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 16,
    marginVertical: 120,
  },
  icon: {
    height: 70,
    width: 70,
    alignSelf: 'center',
    marginHorizontal: 8,
  },
})

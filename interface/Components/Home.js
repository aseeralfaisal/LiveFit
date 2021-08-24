import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Header from './Header';
import Menu from './Meals';
import { useColorScheme } from 'react-native-appearance';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import axios from 'axios';

export default function Home({ navigation, steps, setSteps, setLoggedIn }) {
  let colorScheme = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'dark' ? 'rgb(30, 30, 30)' : 'rgb(30,30,30)',
      }}
    >
      <Header navigation={navigation} setLoggedIn={setLoggedIn} />
      <View style={styles.circlesContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: -50,
          }}
        >
          <View style={styles.circleTile}>
            <AnimatedCircularProgress
              size={110}
              width={6}
              lineCap={'round'}
              fill={steps <= 5 ? 5 : steps}
              tintColor="#29ABE2"
              // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="rgba(80,80,80,0.5)"
              backgroundWidth={13}
            />
            <Image
              source={require('../assets/icons/walk.png')}
              style={styles.circleIcon}
            />
            <Text style={styles.stepsText}>{steps} Steps</Text>
          </View>

          <View style={styles.circleTile}>
            <AnimatedCircularProgress
              size={110}
              width={6}
              lineCap={'round'}
              fill={55}
              tintColor="#29ABE2"
              // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="rgba(80,80,80,0.5)"
              backgroundWidth={13}
            />
            <Image
              source={require('../assets/icons/weight.png')}
              style={styles.circleIcon}
            />
            <Text style={styles.stepsText}>Weight</Text>
          </View>

          <View style={styles.circleTile}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('WalkSteps')}
            >
              <AnimatedCircularProgress
                size={110}
                width={6}
                lineCap={'round'}
                fill={25}
                tintColor="#29ABE2"
                // onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="rgba(80,80,80,0.5)"
                backgroundWidth={13}
              />
              <Image
                source={require('../assets/icons/food.png')}
                style={styles.circleIcon}
              />
              <Text style={styles.stepsText}>Meals</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          marginVertical: -100,
        }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tile: {
    height: 90,
    width: 350,
    borderRadius: 20,
    backgroundColor: 'rgb(50,50,50)',
    borderColor: 'rgb(80,80,80)',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  circleTile: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  circleIcon: {
    width: 50,
    height: 50,
    marginVertical: -80,
    tintColor: 'rgb(255, 140, 83)', //rgb(41, 171, 226) //rgb(255, 140, 83)
    alignSelf: 'center',
  },
  tileText: {
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 18,
  },
  stepsText: {
    color: 'white',
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
});

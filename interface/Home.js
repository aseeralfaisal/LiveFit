import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Header from './Header';
import { useColorScheme } from 'react-native-appearance';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation, steps, setSteps }) {
  let colorScheme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'dark' ? 'rgb(30, 30, 30)' : 'rgb(30,30,30)',
      }}
    >
      <Header navigation={navigation} />
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
              width={5}
              fill={steps <= 5 ? 5 : steps}
              tintColor="#FF8C53"
              // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="rgb(80,80,80)"
            />
            <Image
              source={require('./icons/walk.png')}
              style={styles.circleIcon}
            />
            <Text style={styles.stepsText}>{steps} Steps</Text>
          </View>

          <View style={styles.circleTile}>
            <AnimatedCircularProgress
              size={110}
              width={5}
              fill={55}
              tintColor="#FF8C53"
              // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="rgb(80,80,80)"
            />
            <Image
              source={require('./icons/weight.png')}
              style={styles.circleIcon}
            />
            <Text style={styles.stepsText}>Weight</Text>
          </View>

          <View style={styles.circleTile}>
            <AnimatedCircularProgress
              size={110}
              width={5}
              fill={25}
              tintColor="#FF8C53"
              // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="rgb(80,80,80)"
            />
            <Image
              source={require('./icons/food.png')}
              style={styles.circleIcon}
            />
            <Text style={styles.stepsText}>Meals</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          marginVertical: -100,
        }}
      >
        <TouchableOpacity activeOpacity={0.65}>
          <View style={styles.tile}>
            <Image
              source={require('./icons/leader-board.png')}
              style={styles.icon}
            />
            <Text style={styles.tileText}>Check your Progress</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75}>
          <View style={styles.tile}>
            <Image source={require('./icons/exer.png')} style={styles.icon} />
            <Text style={styles.tileText}>Set your Workouts</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.75}>
          <View style={styles.tile}>
            <Image source={require('./icons/diary.png')} style={styles.icon} />
            <Text style={styles.tileText}>Check your Diary</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    tintColor: '#29ABE2',
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
    fontSize: 14,
    marginVertical: 120,
  },
  icon: {
    height: 70,
    width: 70,
    alignSelf: 'center',
    marginHorizontal: 8,
  },
});

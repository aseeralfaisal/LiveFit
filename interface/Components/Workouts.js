import * as React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, Modal, FlatList, Animated } from 'react-native'
import Header from './Header'
import { useColorScheme } from 'react-native-appearance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { db, storage } from './Firebase'
import axios from 'axios'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { exerciseDATA } from './ExerciseData'
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

export default function Workouts({ navigation }) {
  let colorScheme = useColorScheme()
  const [start, setStart] = React.useState(false)
  const [watch, setWatch] = React.useState(0)
  const [listView, setListView] = React.useState(false)
  const [specificWorkout, setSpecificWorkout] = React.useState(false)
  const [exer, setExer] = React.useState(0)
  const [item, setItem] = React.useState('')
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start()
  }

  const window = Dimensions.get('window')

  React.useEffect(() => {
    if (start) {
      const timer = setTimeout(() => {
        setWatch(watch + 1)
      }, 1000)
      if (watch >= 5) {
        clearTimeout(timer)
        setWatch(0)
        setExer(exer + 1)
        setStart(true)
      }
    }
  })
  const onStart = () => {
    if (start) {
      setListView(false)
      setStart(false)
    } else {
      setListView(true)
      setStart(true)
    }
    fadeIn()
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff'
        }}>
        <Header navigation={navigation} />
        <>
          {listView ? (
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
              <Text style={styles.titleTxt}>{exerciseDATA[exer]?.name}</Text>
              <Image source={exerciseDATA[exer]?.img} />
            </Animated.View>
          ) : (
            <FlatList
              data={exerciseDATA}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <View
                      style={{
                        marginHorizontal: window.width - window.width / 1.1,
                        borderColor: 'rgba(100,100,100,0.25)',
                        borderBottomWidth: 2.5,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setItem(item)
                          setSpecificWorkout(true)
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={[styles.txt, { fontSize: 20 }]}>{index + 1}</Text>
                        <Image source={item.img} style={{ height: 80, width: 80 }} />
                        <Text style={styles.titleTxt}>{item.name}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )
              }}
              numColumns={1}
              keyExtractor={(item, idx) => idx.toString()}
            />
          )}
        </>
        <Modal
          animationType='fade'
          visible={specificWorkout}
          transparent={true}
          onRequestClose={() => setSpecificWorkout(!specificWorkout)}>
          <View style={{ backgroundColor: '#ffffff' }}>
            <View style={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
              <Text style={[styles.titleTxt, { fontSize: 34 }]}>{item.name}</Text>
              <Image source={item.img} />
              <Text style={[styles.txt, { textAlign: 'center' }]}>{item.desc}</Text>
            </View>
          </View>
        </Modal>
        {listView && (
          <Text style={{ fontSize: 40, alignSelf: 'center', fontFamily: 'Comfortaa-Bold', color: 'rgb(80,80,80)' }}>
            {watch}
          </Text>
        )}
        <TouchableOpacity activeOpacity={0.7} style={styles.tile} onPress={onStart}>
          <Text style={{ fontSize: 24, alignSelf: 'center', color: 'white', padding: 5, color: "#555" }}>
            {!start ? 'Start' : 'Pause'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  txt: {
    marginHorizontal: 8,
    fontFamily: 'Comfortaa-Bold',
    color: 'rgb(80,80,80)',
    fontSize: 20,
  },
  titleTxt: {
    marginHorizontal: 8,
    fontFamily: 'Comfortaa-Bold',
    color: 'rgb(80,80,80)',
    fontSize: 20,
    alignSelf: 'center',
  },
  list: {
    flex: 1,
  },
  tile: {
    borderRadius: 25,
    backgroundColor: '#ecf4f7',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    marginHorizontal: 30,
    borderColor: "#000",
    borderWidth: 0.1
  },
})

import * as React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, Modal, FlatList, Animated, TextInput, Button } from 'react-native'
import Header from './Header'
import { useColorScheme } from 'react-native-appearance'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { exerciseDATA } from './ExerciseData'

export default function Workouts({ navigation }) {
  let colorScheme = useColorScheme()
  const [start, setStart] = React.useState(false)
  const [watch, setWatch] = React.useState(0)
  const [listView, setListView] = React.useState(false)
  const [specificWorkout, setSpecificWorkout] = React.useState(false)
  const [exer, setExer] = React.useState(0)
  const [item, setItem] = React.useState('')
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const [playBtn, setPlayBtn] = React.useState("Start")
  const [countStartBtnClick, setCountStartBtnClick] = React.useState(0)
  const [reps, setReps] = React.useState("5")

  const window = Dimensions.get('window')

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start()
  }

  React.useEffect(() => {
    if (start) {
      const timer = setTimeout(() => {
        setWatch(watch + 1)
      }, 1000)
      if (watch == reps) {
        clearTimeout(timer)
        setWatch(0)
        setExer(exer + 1)
        setStart(true)
      }
      if (exer >= 8) {
        setWatch(0)
        setExer(0)
        setListView(false)
        setStart(false)
      }
    }
  })

  const onStart = () => {
    if (start) {
      setCountStartBtnClick(countStartBtnClick + 1)
      setListView(false)
      setStart(false)
    } else {
      setListView(true)
      setStart(true)
    }
    fadeIn()
  }

  React.useEffect(() => {
    if (countStartBtnClick == 0 && !start) {
      setPlayBtn("Start")
    } else if (start) {
      setPlayBtn("Pause")
    } else {
      setPlayBtn("Resume")
    }
  }, [start])

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
              <Image source={exerciseDATA[exer]?.img} style={{ width: 200, resizeMode: 'contain' }} />
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
                        padding: 8,
                        borderBottomWidth: 1,
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
              <Image source={item.img} style={{ width: 170, resizeMode: 'contain' }} />
              <Text style={[styles.txt, { textAlign: 'center' }]}>{item.desc}</Text>
            </View>
          </View>
        </Modal>
        {listView && (
          <Text style={{ fontSize: 40, alignSelf: 'center', fontFamily: 'Comfortaa-Bold', color: 'rgb(80,80,80)' }}>
            {watch}
          </Text>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.txt}>Reps</Text>
            <TextInput placeholder='Reps' keyboardType='numeric' value={reps} onChangeText={(text) => setReps(text)}
              style={{ textAlign: 'center', padding: 5, width: 50, backgroundColor: '#ecf4f7', fontSize: 24, borderRadius: 10, color: "#555" }} />
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.tile} onPress={onStart}>
            <Text style={{ fontSize: 24, alignSelf: 'center', color: 'white', color: "#555" }}>
              {playBtn}
            </Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: 10,
    backgroundColor: '#ecf4f7',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    width: 180,
    padding: 5,
    marginHorizontal: 15,
  },
})

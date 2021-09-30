import * as React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native'
import { Modal as InsideMealDetails } from 'react-native'
import Header from './Header'
import { useColorScheme } from 'react-native-appearance'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from 'react-native-chart-kit'
import axios from 'axios'
import { BlurView } from 'expo-blur'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Meals({ navigation }) {
  let colorScheme = useColorScheme()
  const screenWidth = Dimensions.get('window').width

  const [nutrients, setNutrients] = React.useState('')
  const [totalCal, setTotalCal] = React.useState('')
  const [mealName, setMealName] = React.useState('')
  const [meals, setMeals] = React.useState('')
  const [foodItems, setFoodItems] = React.useState([])
  const [loader, setLoader] = React.useState(false)
  const [modal, setModal] = React.useState(false)
  const [mealDetailModal, setMealDetailModal] = React.useState(false)
  const [foodMenu, setFoodMenu] = React.useState(false)
  const [todaysTime, setTodaysTime] = React.useState(null)
  const [totalMealQuantity, setTotalMealQuantity] = React.useState('')

  const getTodaysDate = () => {
    const date = new Date()
    const currentDate = date.getDate()
    const currentMonth = date.getMonth()
    const currentYear = date.getFullYear()
    setTodaysTime(currentDate + '-' + currentMonth + '-' + currentYear)
    // console.log('today ' + todaysTime)
  }
  React.useEffect(() => {
    getTodaysDate()
    return () => getTodaysDate()
  })

  const ipAddress = '192.168.100.4:3001'
  // const ipAddress = 'livefitnodejs.herokuapp.com'

  const getInfofromServer = async () => {
    const name = await AsyncStorage.getItem('username')
    const user = {
      name,
    }
    const out = await axios.post('http://' + ipAddress + '/api/getUserinfo', user)
    setTotalCal(out.data.dailyGoal)
  }

  const getMealsfromServer = async () => {
    const out = await axios.get('http://' + ipAddress + '/api/getMeals')
    setMeals(out.data)
    // console.log(out.data)
  }

  React.useEffect(() => {
    getInfofromServer()
  }, [])

  // React.useEffect(() => {
  //   getTodaysMeals()
  //   return () => getTodaysMeals()
  // }, [])

  React.useEffect(() => {
    getMealsfromServer()
    return () => getMealsfromServer()
  }, [])

  const addToYourRoutine = async () => {
    const totCals = []
    foodItems.map((item) => totCals.push(item.calories))
    const totalCals = totCals.reduce((a, b) => a + b, 0)
    const Items = { mealName, foodItems, totalCals }
    const res = await axios.post('http://' + ipAddress + '/api/saveInfoToDB', Items)
    setModal(false)
    console.log(res.data)
    getMealsfromServer()
    // getTodaysMeals()
  }

  const addMeals = (name, serve, carbs, protein, fats, calories) => {
    const items = { name, serve, carbs, protein, fats, calories }
    setFoodItems([...foodItems, items])
    console.log(foodItems)
    setFoodMenu(false)
  }

  const getCals = async (text) => {
    setLoader(true)
    const query = { query: text }
    const cals = await axios.post('http://' + ipAddress + '/api/getCalories', query)
    const notFound = {
      name: 'Nothing Found!!!',
    }
    if (cals.data !== 'Error') {
      setNutrients(cals.data)
    } else setNutrients(notFound)
    setLoader(false)
  }

  const [mealDetailName, setMealDetailName] = React.useState('')
  const [mealDetailCals, setMealDetailCals] = React.useState('')

  const insideMealDetail = (items) => {
    setMealDetailName(items.mealName)
    let arrCals = []
    let totCals = []
    items.foodItems.map((item) => arrCals.push(item))
    items.foodItems.map((item) => totCals.push(item.calories))
    const sum = totCals.reduce((a, b) => a + b, 0)
    setTotalMealQuantity(sum)
    setMealDetailCals(arrCals)
    setMealDetailModal(true)
  }

  const data = {
    labels: ['DBY', 'Yesterday', 'Today'],
    datasets: [
      {
        data: [1200, 1600, 1500],
        color: (opacity = 1) => `rgba(80,120,200,${opacity})`, // optional
        strokeWidth: 2.5, // optional
      },
    ],
    // legend: ['Rainy Days'], // optional
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <Header navigation={navigation} />
      {
        <View style={{ marginHorizontal: 10 }}>
          <LineChart
            data={data}
            width={screenWidth - 50}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
                marginLeft: 30,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: 'rgb(80,120,200)',
              },
            }}
            bezier={true}
          />
        </View>
      }

      <TouchableOpacity activeOpacity={0.7} style={[styles.tile, { marginTop: 40 }]} onPress={() => setModal(true)}>
        <Image source={require('../assets/icons/calories.png')} style={styles.tileMenuIcon} />
        <Text style={styles.tileText}>Add calories</Text>
      </TouchableOpacity>

      {/* {todaysMeals && ( */}
      <FlatList
        data={meals}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'rgb(80,80,80)',
              marginHorizontal: 40,
              borderRadius: 20,
              padding: 10,
              display: item.time == todaysTime ? 'flex' : 'none',
            }}
            onPress={() => {
              insideMealDetail(item)
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
              }}>
              {item.mealName} {`${item.totalCals} cals`}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, idx) => idx.toString()}
      />

      <InsideMealDetails
        animationType='slide'
        transparent={true}
        visible={mealDetailModal}
        onRequestClose={() => {
          setMealDetailModal(false)
        }}>
        <View
          style={{
            backgroundColor: 'rgba(10,10,10,0.92)',
            height: '100%',
            width: '100%',
          }}>
          <Text style={[styles.text, { alignSelf: 'center', color: '#FF8C53', marginBottom: 30 }]}>{mealDetailName}</Text>

          {mealDetailCals ? (
            <FlatList
              data={mealDetailCals}
              renderItem={({ item }) => (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'white',
                      flexDirection: 'row',
                      alignSelf: 'center',
                      textTransform: 'capitalize',
                    }}>
                    {item.name} {item.calories} cals
                  </Text>
                </View>
              )}
              keyExtractor={(item, idx) => idx.toString()}
            />
          ) : (
            <View></View>
          )}
          <Text style={{ color: 'white' }}>{totalMealQuantity}</Text>
        </View>
      </InsideMealDetails>
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
            height: '100%',
            width: '100%',
          }}>
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <TextInput
              placeholder='Meal name'
              placeholderTextColor='gray'
              value={mealName}
              onChangeText={(text) => setMealName(text)}
              style={styles.inputField2}
            />
          </View>

          <View style={{ marginVertical: 20, alignItems: 'center' }}>
            {/* <Text
              style={{
                color: '#FF8C53',
                textTransform: 'capitalize',
                alignSelf: 'center',
                marginHorizontal: 32,
                fontSize: 30,
                letterSpacing: 3,
                marginVertical: 7,
              }}>
              Meals
            </Text> */}

            <FlatList
              data={foodItems}
              renderItem={({ item }) => (
                <Text style={styles.mealDetails}>
                  {item.name} {'->'} {item.serve + 'g' + ' '} {item.carbs + 'g' + ' '}
                  {item.protein + 'g' + ' '}
                  {item.fats + 'g' + ' '}
                </Text>
              )}
              keyExtractor={(item, idx) => idx.toString()}
            />
          </View>

          <TouchableOpacity activeOpacity={0.7} style={styles.tile} onPress={() => setFoodMenu(true)}>
            <Image source={require('../assets/icons/search.png')} style={styles.tileMenuIcon} />
            <Text style={styles.tileText}>Search food items</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.tile} onPress={() => addToYourRoutine()}>
            <Image source={require('../assets/icons/add.png')} style={styles.tileMenuIcon} />
            <Text style={styles.tileText}>Add to your routine</Text>
          </TouchableOpacity>

          <Modal
            animationType='none'
            transparent={true}
            visible={foodMenu}
            onRequestClose={() => {
              setFoodMenu(false)
              setNutrients(false)
            }}>
            <View style={styles.modal2}>
              <TextInput
                placeholder='Search foods...'
                placeholderTextColor='rgba(80,80,80,0.8)'
                onChangeText={(val) => {
                  setLoader(false)
                  setNutrients('')
                }}
                onSubmitEditing={(event) => getCals(event.nativeEvent.text)}
                style={styles.inputField2}
              />
              {!nutrients && (
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={require('../assets/icons/search_logo.png')}
                    style={[styles.tileMenuIcon, { tintColor: 'rgba(80,120,200,0.3)', height: 144, width: 200, marginTop: 50 }]}
                  />
                  <Text style={[styles.text, { fontSize: 30, marginTop: 30, color: 'rgba(80,120,200,0.3)' }]}>Search food items</Text>
                </View>
              )}

              <ActivityIndicator size={140} color='#FF8C53' style={{ display: loader ? 'flex' : 'none', marginTop: 40 }} />

              <View style={nutrients ? styles.calorieChart : styles.calorieChart_none}>
                <Text style={styles.foodName}>{nutrients.name}</Text>

                <View
                  style={{
                    display: nutrients.name === 'Nothing Found!!!' ? 'none' : 'flex',
                  }}>
                  <Text style={styles.text}>Serving size: {nutrients.serving_size_g} gm</Text>
                  <Text style={styles.text}>Carbohydrates: {nutrients.carbohydrates_total_g} gm</Text>
                  <Text style={styles.text}>Protein: {nutrients.protein_g} gm</Text>
                  <Text style={styles.text}>Fats: {nutrients.fat_total_g} gm</Text>
                  <Text style={styles.text}>Total calories: {nutrients.calories} cals</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.btn}
                    onPress={() =>
                      addMeals(
                        nutrients.name,
                        nutrients.serving_size_g,
                        nutrients.carbohydrates_total_g,
                        nutrients.protein_g,
                        nutrients.fat_total_g,
                        nutrients.calories
                      )
                    }>
                    <Text style={styles.btnText}>Add item </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </Modal>
      {/* </ScrollView> */}
    </View>
  )
}
const styles = StyleSheet.create({
  InfoIconsOnly: {
    width: 35,
    height: 35,
    marginHorizontal: 5,
    alignItems: 'center',
    tintColor: '#FF8C53',
  },
  aboutInfoText: {
    marginVertical: 15,
    color: 'white',
    // alignSelf: 'flex-end',
    fontSize: 20,
    color: 'white', //#FF8C53
  },
  infoIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    fontSize: 16,
  },
  tileMenuIcon: {
    height: 35,
    width: 35,
    marginHorizontal: 5,
  },
  inputField2: {
    marginVertical: 10,
    color: 'rgb(80,80,80)',
    borderBottomWidth: 2,
    borderColor: 'rgba(80,80,80,0.3)',
    textAlign: 'center',
    fontSize: 16,
    height: 45,
    width: '70%',
    alignSelf: 'center',
    fontWeight: 'normal',
    ...Platform.select({
      ios: {
        fontFamily: 'Comfortaa-Bold',
      },
      android: {
        fontFamily: 'Comfortaa-Bold',
      },
    }),
  },
  modal: {
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.5)',
    height: '100%',
    width: '100%',
  },
  modal2: {
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  circleIcon: {
    width: 50,
    height: 50,
    marginVertical: -80,
    tintColor: 'rgb(80,80,80)', //rgb(41, 171, 226) //rgb(255, 140, 83)
    alignSelf: 'center',
  },
  inCircle: {
    position: 'absolute',
    width: 75,
    height: 75,
    marginTop: 40,
    alignSelf: 'center',
    tintColor: 'rgb(80,80,80)',
  },
  calText: {
    color: 'rgb(80,80,80)',
    fontSize: 35,
    position: 'absolute',
    paddingTop: 110,
    alignSelf: 'center',
  },
  foodName: {
    color: '#FF8C53',
    alignSelf: 'flex-start',
    fontSize: 40,
    letterSpacing: 4,
    textTransform: 'capitalize',
    marginBottom: 10,
    fontFamily: 'Comfortaa-Bold',
  },
  text: {
    color: '#fff',
    alignSelf: 'flex-start',
    fontSize: 18,
  },
  text: {
    color: 'rgb(80,80,80)',
    alignSelf: 'flex-start',
    fontSize: 18,
  },
  tableText: {
    paddingHorizontal: 10,
    color: 'white',
    alignSelf: 'flex-start',
    fontSize: 15,
  },
  inputField: {
    marginTop: 80,
    color: 'white',
    backgroundColor: 'rgb(80,80,80)',
    textAlign: 'center',
    borderRadius: 20,
    fontSize: 16,
    width: 320,
    height: 45,
  },
  meals: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: 'rgb(80,80,80)',
    marginHorizontal: 40,
    borderRadius: 20,
    padding: 10,
  },
  calorieChart: {
    marginVertical: 25,
    backgroundColor: 'rgba(80,120,200,0.2)',
    marginHorizontal: 40,
    borderRadius: 20,
    padding: 20,
    width: 320,
  },
  calorieChart_none: {
    display: 'none',
  },
  btn: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#29ABE2', //#29ABE2 //#FF8C53
    borderRadius: 20,
  },
  btnSearchfood: {
    paddingVertical: 10,
    backgroundColor: '#29ABE2', //#29ABE2 //#FF8C53
    borderRadius: 20,
    marginHorizontal: 40,
  },
  mealDetails: {
    textTransform: 'capitalize',
    alignSelf: 'flex-start',
    marginVertical: 7,
    paddingVertical: 10,
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 50,
    backgroundColor: 'rgba(100,100,100,0.5)',
  },
  btnText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 15,
  },
})

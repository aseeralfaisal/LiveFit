import * as React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, TextInput, FlatList, ScrollView, Modal, Dimensions } from 'react-native'
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

  const [nutrients, setNutrients] = React.useState('')
  const [totalCal, setTotalCal] = React.useState('')
  const [mealName, setMealName] = React.useState('')
  const [meals, setMeals] = React.useState('')
  const [todaysMeals, setTodaysMeals] = React.useState([])
  const [foodItems, setFoodItems] = React.useState([])
  const [loader, setLoader] = React.useState(false)
  const [modal, setModal] = React.useState(false)
  const [mealDetailModal, setMealDetailModal] = React.useState(false)
  const [foodMenu, setFoodMenu] = React.useState(false)

  const ipAddress = '192.168.100.5:3001'

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
  }

  const getTodaysMeals = async () => {
    const out = await axios.get('http://' + ipAddress + '/api/findTodaysMeals')
    setTodaysMeals([out.data])
  }

  React.useEffect(() => {
    getInfofromServer()
  }, [])

  React.useEffect(() => {
    getTodaysMeals()
  }, [])

  React.useEffect(() => {
    getMealsfromServer()
    return () => getMealsfromServer()
  }, [])

  const addMeals = (name, serve, carbs, protein, fats, calories) => {
    const items = { name, serve, carbs, protein, fats, calories }
    setFoodItems([...foodItems, items])
    console.log(foodItems)
    setFoodMenu(false)
  }

  const addItemToDB = async () => {
    const Items = { mealName, foodItems }
    const res = await axios.post('http://' + ipAddress + '/api/saveInfoToDB', Items)
    setModal(false)
    console.log(res.data)
    getMealsfromServer()
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
  const [mealDetailCals, setMealDetailCals] = React.useState([])

  const insideMealDetail = (items) => {
    console.log(items)
    setMealDetailName(items.mealName)
    let arrCals = []
    items.foodItems.map((item) => arrCals.push(item))
    setMealDetailCals(arrCals)
    setMealDetailModal(true)
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? 'rgb(30, 30, 30)' : 'rgb(30,30,30)',
      }}
    >
      {/* <ScrollView> */}
      <Header navigation={navigation} />
      <View style={styles.circleContainer}>
        <AnimatedCircularProgress
          size={240}
          width={8}
          fill={60}
          tintColor="#29ABE2"
          lineCap={'round'}
          backgroundColor="rgba(80,80,80,0.4)"
          backgroundWidth={16}
          style={{
            marginBottom: -220,
          }}
        />

        <View>
          <Image style={styles.inCircle} source={require('../assets/icons/calories.png')} />
          <Text style={styles.calText}>{totalCal}</Text>
        </View>

        <AnimatedCircularProgress size={200} width={6} fill={60} tintColor="#FF8C53" lineCap={'round'} backgroundColor="rgba(80,80,80,0.4)" backgroundWidth={16} />
      </View>
      <View style={{ alignSelf: 'center', marginTop: 30 }}>
        <View style={{ alignSelf: 'center', marginTop: 20, flexDirection: 'row' }}>
          <Text style={[styles.text, { color: '#FF8C53', marginHorizontal: 5 }]}>Food: 500</Text>
          <Text style={[styles.text, { color: '#FF8C53', marginHorizontal: 5 }]}>Remaining: 1500</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.btnSearchfood, { marginTop: 20 }]} onPress={() => setModal(true)}>
        <Text style={styles.btnText}>Add a meal</Text>
      </TouchableOpacity>
      {/* Meal details */}
      <FlatList
        data={todaysMeals}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.meals}
            onPress={() => {
              insideMealDetail(item)
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontFamily: 'Comfortaa-Bold',
              }}
            >
              {item.mealName} {item.time}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontFamily: 'Comfortaa-Bold',
              }}
            >
              {item.calories}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, idx) => item._id}
      />
      <InsideMealDetails
        animationType="slide"
        transparent={true}
        visible={mealDetailModal}
        onRequestClose={() => {
          setMealDetailModal(false)
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(10,10,10,0.92)',
            height: '100%',
            width: '100%',
          }}
        >
          <Text style={[styles.text, { alignSelf: 'center' }]}>{mealDetailName}</Text>
          {/* <Text style={[styles.text, { alignSelf: 'center' }]}>{mealDetailCals}</Text> */}

          <FlatList
            data={mealDetailCals}
            renderItem={({ item }) => (
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  fontFamily: 'Comfortaa-Bold',
                  flexDirection: 'row',
                }}
              >
                {item.name} {item.calories}
              </Text>
            )}
            keyExtractor={(item, idx) => idx}
          />
        </View>
      </InsideMealDetails>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false)
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(10,10,10,0.92)',
            height: '100%',
            width: '100%',
          }}
        >
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <TextInput placeholder="Meal name" placeholderTextColor="gray" value={mealName} onChangeText={(text) => setMealName(text)} style={styles.inputField2} />
          </View>

          <View style={{ marginVertical: 20, alignItems: 'center' }}>
            <Text
              style={{
                color: '#FF8C53',
                textTransform: 'capitalize',
                alignSelf: 'flex-start',
                marginHorizontal: 32,
                fontSize: 30,
                letterSpacing: 3,
                fontFamily: 'Comfortaa-Bold',
                marginVertical: 7,
              }}
            >
              Meals
            </Text>
            <FlatList
              data={foodItems}
              renderItem={({ item }) => (
                <Text
                  style={{
                    color: '#FF8C53',
                    textTransform: 'capitalize',
                    alignSelf: 'flex-start',
                    fontFamily: 'Comfortaa-Bold',
                    fontSize: 18,
                    marginVertical: 7,
                  }}
                >
                  {item.name} {'->'} {item.serve + 'g' + ' '} {item.carbs + 'g' + ' '}
                  {item.protein + 'g' + ' '}
                  {item.fats + 'g' + ' '}
                </Text>
              )}
              keyExtractor={(item, idx) => idx.toString()}
            />
          </View>

          <TouchableOpacity onPress={() => setFoodMenu(true)}>
            <Text
              style={[
                styles.btnSearchfood,
                {
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: 'Comfortaa-Bold',
                },
              ]}
            >
              Search food items
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => addItemToDB()}>
            <Text
              style={[
                styles.btnSearchfood,
                {
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: 'Comfortaa-Bold',
                  marginVertical: 10,
                },
              ]}
            >
              Save to DB
            </Text>
          </TouchableOpacity>

          <Modal animationType="none" transparent={true} visible={foodMenu} onRequestClose={() => setFoodMenu(false)}>
            <View style={styles.modal2}>
              <TextInput
                placeholder="Search foods..."
                placeholderTextColor="rgb(150,150,150)"
                onChangeText={(val) => {
                  setLoader(false)
                  setNutrients('')
                }}
                onSubmitEditing={(event) => getCals(event.nativeEvent.text)}
                style={styles.inputField}
              />

              <ActivityIndicator size={140} color="#FF8C53" style={{ display: loader ? 'flex' : 'none', marginTop: 40 }} />

              <View style={nutrients ? styles.calorieChart : styles.calorieChart_none}>
                <Text style={styles.foodName}>{nutrients.name}</Text>

                <View
                  style={{
                    display: nutrients.name === 'Nothing Found!!!' ? 'none' : 'flex',
                  }}
                >
                  <Text style={styles.text}>Serving size: {nutrients.serving_size_g} gm</Text>
                  <Text style={styles.text}>Carbohydrates: {nutrients.carbohydrates_total_g} gm</Text>
                  <Text style={styles.text}>Protein: {nutrients.protein_g} gm</Text>
                  <Text style={styles.text}>Fats: {nutrients.fat_total_g} gm</Text>
                  <Text style={styles.text}>Total calories: {nutrients.calories} cals</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.btn}
                    onPress={() => addMeals(nutrients.name, nutrients.serving_size_g, nutrients.carbohydrates_total_g, nutrients.protein_g, nutrients.fat_total_g, nutrients.calories)}
                  >
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
    fontFamily: 'Comfortaa-Bold',
    fontSize: 20,
    color: 'white', //#FF8C53
  },
  infoIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputField2: {
    marginVertical: 10,
    color: 'white',
    borderBottomWidth: 2,
    borderColor: 'rgb(80,80,80)',
    textAlign: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 16,
    width: 300,
    height: 45,
    alignSelf: 'center',
  },
  modal: {
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.5)',
    height: '100%',
    width: '100%',
  },
  modal2: {
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.85)',
    height: '100%',
    width: '100%',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  inCircle: {
    position: 'absolute',
    width: 75,
    height: 75,
    marginTop: 40,
    alignSelf: 'center',
    tintColor: '#FF8C53',
  },
  calText: {
    color: 'rgb(255, 140, 83)',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 35,
    position: 'absolute',
    paddingTop: 110,
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
  },
  foodName: {
    color: '#FF8C53',
    alignSelf: 'flex-start',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 40,
    letterSpacing: 4,
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    alignSelf: 'flex-start',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 18,
  },
  inputField: {
    marginTop: 80,
    color: 'white',
    backgroundColor: 'rgb(80,80,80)',
    textAlign: 'center',
    borderRadius: 20,
    fontFamily: 'Comfortaa-Bold',
    fontSize: 16,
    width: 320,
    height: 45,
  },
  meals: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: 'rgb(80,80,80)',
    marginHorizontal: 40,
    borderRadius: 20,
    padding: 10,
    width: 320,
  },
  calorieChart: {
    marginVertical: 25,
    backgroundColor: 'rgb(80,80,80)',
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
    // marginTop: 60,
    paddingVertical: 10,
    backgroundColor: '#29ABE2', //#29ABE2 //#FF8C53
    borderRadius: 20,
    marginHorizontal: 40,
  },
  btnText: {
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 15,
  },
})

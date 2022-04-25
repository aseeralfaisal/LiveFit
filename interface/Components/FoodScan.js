import { StatusBar } from 'expo-status-bar'
import React from 'react'
import * as MediaLibrary from 'expo-media-library'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Button } from 'react-native'
import { Camera } from 'expo-camera'
import { useState, useEffect, createRef } from 'react'
import * as Clarifai from "clarifai"
import * as ImageManipulator from "expo-image-manipulator"
import axios from 'axios'
import { BlurView } from 'expo-blur'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

export default function FoodScan() {
  const [predictions, setPredictions] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [pic, setPic] = useState()
  const [servingSize, setServingSize] = useState("")
  const [calories, setCalories] = useState("")
  const [carbs, setCarbs] = useState("")
  const [cholestrol, setCholestrol] = useState("")
  const [saturatedFat, setSaturatedFat] = useState("")
  const [fatTotal, setFatTotal] = useState("")
  const [fiber, setFiber] = useState("")
  const [pottasium, setPotassium] = useState("")
  const [protein, setProtein] = useState("")
  const [sodium, setSodium] = useState("")
  const [sugar, setSugar] = useState("")
  const [camView, setCamView] = useState(true)
  const [iconSize, setIconSize] = useState(30)

  useEffect(() => {
    (async () => {
      try {
        let cam = await Camera.getPermissionsAsync()
        const media = await MediaLibrary.getPermissionsAsync()
        if (media.status !== "granted" && cam.status === "granted") {
          await MediaLibrary.requestPermissionsAsync()
          await cam.requestPermissionsAsync()
        }
      } catch (err) {
        console.log(err)
      }
    })()
  })

  const clarifaiApp = new Clarifai.App({
    apiKey: "d5f2958f4b0b4b38acfbc2921cf5de81",
  })
  const clarifaiDetectObjectsAsync = async (source) => {
    try {
      const newPredictions = await clarifaiApp.models.predict(
        { id: Clarifai.FOOD_MODEL },
        { base64: source },
        { maxConcepts: 10, minValue: 0.4 }
      )
      setPredictions(newPredictions?.outputs[0]?.data?.concepts[0]?.name)
      const nutrientData = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${newPredictions?.outputs[0]?.data?.concepts[0]?.name}`, {
        headers: {
          'X-Api-Key': 'LUqUEvZwtBGEm9YqPvcb5g==rwCrBFMK8LHjYWQI',
          'Conetent-Type': 'Application/json',
        },
      })
      // console.log(nutrientData.data.items)
      nutrientData.data.items.forEach(item => {
        setCalories(item?.calories)
        setCarbs(item?.carbohydrates_total_g)
        setCholestrol(item?.cholesterol_mg)
        setSaturatedFat(item?.fat_saturated_g)
        setFatTotal(item?.fat_total_g)
        setFiber(item?.fiber_g)
        setPotassium(item?.potassium_mg)
        setProtein(item?.protein_g)
        setServingSize(item?.serving_size_g)
        setSodium(item?.sodium_mg)
        setSugar(item?.sugar_g)
      })
    } catch (error) {
      console.log("Exception Error: ", error)
    }
  }

  const cameraRef = createRef()
  const takeSnap = async () => {
    const data = await cameraRef.current.takePictureAsync()
    const manipResponse = await ImageManipulator.manipulateAsync(
      data.uri,
      [{ resize: { width: 900 } }],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    )
    setPic(manipResponse.uri)
    await clarifaiDetectObjectsAsync(manipResponse.base64)
  }


  return (
    <View style={styles.container}>
      {camView ? <Camera
        style={{ width: "100%", height: "99.9%" }}
        type={type}
        ref={cameraRef}
        ratio="16:8"

      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.snapBtn} onPress={() => takeSnap()}>
            <Text style={styles.nuDataTxt}>Get Nutrion Data</Text>
          </TouchableOpacity>
        </View>
        {pic && <TouchableOpacity style={styles.nuInfosBtn} onPress={() => setCamView(false)}>
          <Text style={styles.preTxt}>{predictions}</Text>
          {calories !== "" ? <Text style={styles.calTxt}>{calories} cals per {servingSize} gm</Text>
            :
            <Text style={styles.calTxt}>Getting Info....</Text>
          }
        </TouchableOpacity>}
      </Camera>
        :
        <View style={{ margin: 55, alignItems: 'flex-start' }}>
          {/* <Text style={[styles.nuDataTxt, { fontSize: 24, width: 290 }]}>All the Nutrients</Text> */}
          <Text style={[styles.nuDataTxt, { fontSize: 32, margin: 14, textTransform: 'capitalize' }]}>{predictions}</Text>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Serving Size: {servingSize} g</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Calories: {calories} cals</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Carbohydrates: {carbs} gm</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Protein: {protein} gm</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Saturated Fat: {saturatedFat} gm</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Total Fat:{fatTotal} gm</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Sodium: {sodium} mg</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Pottasium: {pottasium} mg</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Cholestrol: {cholestrol} mg</Text>
          </View>
          <View style={styles.nuTextParent}>
            <FontAwesomeIcon icon={icons.faAnglesRight} size={iconSize} style={{ margin: 10 }} />
            <Text style={styles.nutrientDataTxt}>Sugar: {sugar} gm</Text>
          </View>
          <TouchableOpacity style={{ margin: 15, backgroundColor: '#555', borderRadius: 10, padding: 10, justifyContent: 'center' }} onPress={() => setCamView(true)}>
            <Text style={styles.text}>Exit Menu</Text>
          </TouchableOpacity>
        </View>
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nuTextParent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nuDataTxt: {
    color: "#000", textAlign: 'center', fontSize: 18, letterSpacing: 5, fontFamily: 'Comfortaa-Bold'
  },
  nuInfosBtn: {
    width: "100%", height: 100, top: -140, justifyContent: 'center', alignSelf: 'center', backgroundColor: "#eee"
  },
  preTxt: {
    color: '#111', fontSize: 30, textAlign: 'center', textTransform: 'capitalize', letterSpacing: 3, fontFamily: "Comfortaa-Bold"
  },
  calTxt: {
    color: '#111', fontSize: 15, textAlign: 'center', fontFamily: 'Comfortaa-Bold'
  },
  camera: {
    flex: 1,
  },
  snapBtn: {
    marginTop: "200%",
    width: "100%",
    height: 100,
    borderRadius: 25,
    backgroundColor: "#eee",
    opacity: 0.8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#fff",
    zIndex: 5,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.5,
    borderWidth: 0,
    borderColor: "#fff"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
    display: 'flex',
    justifyContent: 'center',
    marginTop: -20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Comfortaa-Bold'
  },
  nutrientDataTxt: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Comfortaa-Bold',
  }
});

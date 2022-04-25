import { StatusBar } from 'expo-status-bar'
import React from 'react'
import * as MediaLibrary from 'expo-media-library'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { Camera } from 'expo-camera'
import { useState, useEffect, createRef } from 'react'
import * as Clarifai from "clarifai"
import * as ImageManipulator from "expo-image-manipulator"
import axios from 'axios'

export default function FoodScan() {
  const [predictions, setPredictions] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [pic, setPic] = useState()
  const [servingSize, setServingSize] = useState("")
  const [calories, setCalories] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const cam = await Camera.requestPermissionsAsync()
        console.log(cam)
        const media = await MediaLibrary.getPermissionsAsync()
        if (media.status !== "granted") {
          await MediaLibrary.requestPermissionsAsync()
        }
      } catch (err) {
        console.log(err)
      }
    })()
  })
  // useEffect(() => {
  //   setTimeout(() => {
  //     setPic()
  //   }, 6000);
  // })

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
      nutrientData.data.items.forEach(item => {
        setServingSize(item?.serving_size_g)
        setCalories(item?.calories)
        console.log(item.serving_size_g)
        console.log(item.calories)
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
    // await MediaLibrary.saveToLibraryAsync(manipResponse.uri)
    setPic(manipResponse.uri)
    await clarifaiDetectObjectsAsync(manipResponse.base64)
  }


  return (
    <View style={styles.container}>
      <Camera
        style={{ width: "100%", height: "99.9%" }}
        type={type}
        ref={cameraRef}
        ratio="16:8"
      >
        {/* <View style={{ width: "100%", backgroundColor: "#000", opacity: 0.7, height: 500, top: "80%", position: 'fixed' }}>
        </View> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.snapBtn} activeOpacity={0.7} onPress={() => takeSnap()}>
            <Text style={{ color: "#000", textAlign: 'center', fontSize: 18, letterSpacing: 5 }}>Get Nutrion Data</Text>
          </TouchableOpacity>
        </View>
        {pic && <View style={{ width: "100%", height: 100, top: -140, justifyContent: 'center', alignSelf: 'center', backgroundColor: "#111" }}>
          <Text style={{ color: '#fff', fontSize: 30, textAlign: 'center', textTransform: 'capitalize', letterSpacing: 3 }}>{predictions}</Text>
          {calories !== "" ? <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>{calories} cals per {servingSize} gm</Text>
            :
            <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>Getting Info....</Text>
          }
        </View>}
        {/* {pic && <View>
          <Image source={{ uri: pic }} style={{ width: 100, height: 100 }} />
        </View>} */}
      </Camera>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  snapBtn: {
    marginTop: "200%",
    width: "100%",
    height: 100,
    borderRadius: 25,
    backgroundColor: "#aaa",
    opacity: 0.9,
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
  },
});

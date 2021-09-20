const express = require('express')
const mongoose = require('mongoose')
const User = require('./UserSchema')
const Meals = require('./MealsSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()
require('dotenv').config()
const multer = require('multer')
const axios = require('axios')
const fetch = require('node-fetch')
const admin = require('firebase-admin')
const serviceAccount = require('./livefit-cc5f1-firebase-adminsdk-gmipj-d2abcf3750.json')
const { countDocuments } = require('./UserSchema')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const firestore = admin.firestore()

const PORT = 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const DB = 'mongodb+srv://aseer:afs10298@cluster0.tfzip.mongodb.net/UsersDB?retryWrites=true&w=majority'

mongoose
  .connect(DB, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log('connected'))
  .catch((err) => console.log(err))

app.post('/api', (req, res) => {
  const query = req.body.query
  res.send(query)
})
app.get('/api', (req, res) => {
  res.send('API is Working')
})

app.post('/fire', (req, res) => {
  const name = req.body.name
  firestore
    .collection('name')
    .add({
      name,
    })
    .then((output) => output)
    .then((out) => res.json({ out }))
})

app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.sendStatus(404).json({
        err: 'No files exist',
      })
    }
    return res.json(files)
  })
})

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      })
    }
    return res.json(file)
  })
})

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      })
    }

    if (file.contentType === 'image/jpg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfs.createReadStream(file.filename)
      readstream.pipe(res)
    } else {
      res.status(404).json({
        err: 'Not an image',
      })
    }
  })
})

app.post('/api/signup', async (req, res) => {
  try {
    const userExists = await User.findOne({ name: req.body.name })
    if (!userExists) {
      const { name, pass } = req.body
      const hashPass = await bcrypt.hash(pass, 10)
      const response = await User.create({
        name,
        pass: hashPass,
      })
      res.json({ response })
    } else res.send('User already exists')
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { name, pass } = req.body
    const user = await User.findOne({ name: name })

    if (!user) return res.status(403).json({ error: 'Invalid Username' })

    if (await bcrypt.compare(pass, user.pass)) {
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
        },
        "secret_key"
      )
      return res.status(200).json({ token, txt: 'Granted' })
    } else {
      res.status(403).json({ txt: 'Wrong Password' })
    }
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/getDpLink', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name })
    const output = await user.get('dpLink')
    res.json({ result: output })
  } catch (err) {
    console.log(err)
  }
})
app.post('/api/dpLink', async (req, res) => {
  try {
    User.findOneAndUpdate({ name: req.body.name }, { dpLink: req.body.dpLink }, { new: true }, (err, data) => {
      if (!err) {
        res.send(data)
      } else {
        console.log(err)
      }
    })
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/getCalories', async (req, res) => {
  try {
    const query = await req.body.query
    const fetchApi = await fetch('https://api.calorieninjas.com/v1/nutrition?query=' + query, {
      method: 'GET',
      headers: {
        'X-Api-Key': 'LUqUEvZwtBGEm9YqPvcb5g==rwCrBFMK8LHjYWQI',
        'Conetent-Type': 'Application/json',
      },
    })
    const result = await fetchApi.json()
    const items = result.items
    items.forEach((item) => {
      res.send(item)
    })
    if (res.statusMessage == undefined) {
      res.send('Error')
    }
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/saveInfoToDB', async (req, res) => {
  const mealName = req.body.mealName
  const foodItems = req.body.foodItems
  const date = new Date()
  const currentDate = date.getDate()
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()
  const food = await Meals.create({
    mealName,
    foodItems,
    time: currentDate + '-' + currentMonth + '-' + currentYear,
  })
  res.send(food)
})
app.get('/api/findTodaysMeals', async (req, res) => {
  try {
    const date = new Date()
    const currentDate = date.getDate()
    const currentMonth = date.getMonth()
    const currentYear = date.getFullYear()
    const time = currentDate + '-' + currentMonth + '-' + currentYear
    const food = await Meals.findOne({ time: time })
    res.send(food)
  } catch (err) {
    console.log(err)
  }
})

app.get('/api/getMeals', (req, res) => {
  Meals.find((err, docs) => {
    res.send(docs)
  })
})

app.post('/api/getMealsByID', async (req, res) => {
  const id = req.body.id
  const out = await Meals.findById(id)
  res.send(out)
})

app.post('/api/userinfo', async (req, res) => {
  try {
    const name = req.body.name
    const dailyGoal = req.body.dailyGoal
    const bodyfat = req.body.bodyfat
    const bodyweight = req.body.bodyweight
    const height = req.body.height
    User.findOneAndUpdate({ name }, { dailyGoal, bodyfat, bodyweight, height }, { new: true }, (err, data) => {
      if (!err) {
        res.send(data)
      } else {
        console.log(err)
      }
    })
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/getUserinfo', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name })
    const dailyGoal = await user.get('dailyGoal')
    const bodyweight = await user.get('bodyweight')
    const bodyfat = await user.get('bodyfat')
    const height = await user.get('height')
    res.send({ dailyGoal, bodyweight, bodyfat, height })
  } catch (err) {
    console.log(err)
  }
})

app.listen(process.env.PORT || PORT, () => {
  console.log('Server is listening to ' + PORT)
})

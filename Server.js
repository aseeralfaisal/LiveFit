const express = require('express');
const mongoose = require('mongoose');
const User = require('./UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
require('dotenv').config();
const multer = require('multer');
const axios = require('axios');
const fetch = require('node-fetch');
// const { GridFsStorage } = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const Grid = require('gridfs-bucket');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.DB, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

console.log('Connected to DB');

// let gfs;

// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('users');
// });

// const storage = new GridFsStorage({
//   url: process.env.DB,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       const fileInfo = {
//         filename: file.originalname,
//         bucketName: 'users',
//       };
//       resolve(fileInfo);
//     });
//   },
// });
// const upload = multer({ storage });

// app.post('/upload', upload.single('file'), (req, res) => {
//   res.json({ file: req.file });
//   console.log(req.file);
// });

app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.sendStatus(404).json({
        err: 'No files exist',
      });
    }
    return res.json(files);
  });
});

app.get('/files/:filename', (req, res) => {
  `gfs`.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }
    return res.json(file);
  });
});

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }

    if (
      file.contentType === 'image/jpg' ||
      file.contentType === 'image/jpeg' ||
      file.contentType === 'image/png'
    ) {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image',
      });
    }
  });
});

app.post('/api/signup', async (req, res) => {
  try {
    const userExists = await User.findOne({ name: req.body.name });
    if (!userExists) {
      const { name, pass } = req.body;
      const hashPass = await bcrypt.hash(pass, 10);
      const response = await User.create({
        name,
        pass: hashPass,
      });
      res.json({ response });
    } else res.send('User already exists');
  } catch (err) {
    console.log('error');
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, pass } = req.body;
    const user = await User.findOne({ name: name });

    if (!user) return res.status(403).json({ error: 'Invalid Username' });

    if (await bcrypt.compare(pass, user.pass)) {
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
        },
        process.env.PRIVATE_KEY
      );
      return res.status(200).json({ token, txt: 'Granted' });
    } else {
      res.status(403).json({ txt: 'Wrong Password' });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/getDpLink', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    const output = await user.get('dpLink');
    res.json({ result: output });
  } catch (err) {
    console.log(err);
  }
});
app.post('/api/dpLink', async (req, res) => {
  try {
    User.findOneAndUpdate(
      { name: req.body.name },
      { dpLink: req.body.dpLink },
      { new: true },
      (err, data) => {
        if (!err) {
          res.send(data);
        } else {
          console.log(err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/getCalories', async (req, res) => {
  try {
    const query = req.body.query;
    const fetchApi = await fetch(
      'https://api.calorieninjas.com/v1/nutrition?query=' + query,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': 'LUqUEvZwtBGEm9YqPvcb5g==rwCrBFMK8LHjYWQI',
          'Conetent-Type': 'Application/json',
        },
      }
    );
    const result = await fetchApi.json();
    res.json({ result });
    const item = result.items;
    for (let i = 0; i < item.length; i++) {
      console.log(item[i]);
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log('Server is listening to ' + PORT);
});

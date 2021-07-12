const express = require('express');
const mongoose = require('mongoose');
const User = require('./UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
require('dotenv').config();

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(PORT, () => {
  console.log('Server is listening to ' + PORT);
});

(async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
})();

app.get('/api', (req, res) => {
  res.json({ msg: 'Hello' });
});

app.post('/api/signup', async (req, res) => {
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
});

app.post('/api/login', async (req, res) => {
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
});

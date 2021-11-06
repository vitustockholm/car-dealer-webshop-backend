import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

import UserAndCars from './models/userAndCarsModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Connecting DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((response) => {
    console.log(`Connected to MongoDB`.blue.underline.bold);
    // Starting server
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}...`.yellow.underline.bold)
    );
  });

// Routes
app.get('/', (req, res) => res.send('API is running...'));

// GET: all cars
app.get('/api/cars', (req, res) => {
  UserAndCars.find({}).then((data) => res.json(data));
});

// GET: get single user based on id
app.get('/api/users/:id', (req, res) => {
  let userId = req.params.id;

  UserAndCars.findById(userId).then((result) => {
    res.json(result);
  });
});

// POST: register new user
app.post('/api/users/signup', (req, res) => {
  let user = req.body;

  UserAndCars.find().then((result) => {
    const userExists = result.some(
      (userFromDB) => userFromDB.email === user.email
    );

    if (userExists) {
      res.json({
        registrationStatus: 'failed',
        message: 'User with given email already exists',
      });
    } else {
      user.cars = [];

      const newUser = new UserAndCars(user);

      newUser.save().then((result) => {
        let { _id } = result;
        res.json({
          registrationStatus: 'success',
          userId: _id,
        });
      });
    }
  });
});

// POST: Log in existing user
app.post('/api/users/login', (req, res) => {
  let user = req.body;

  UserAndCars.find().then((result) => {
    let userFounded = result.find(
      (userFromDB) =>
        userFromDB.email === user.email && userFromDB.password === user.password
    );

    if (userFounded) {
      let { _id } = userFounded;

      res.json({
        loginStatus: 'success',
        userId: _id,
      });
    } else {
      res.status(401).json({
        loginStatus: 'failed',
        message: 'Given email or password is incorrect',
      });
    }
  });
});

// PUT: Delete single car based on it's id
app.put('/api/cars/delete/:id', async (req, res) => {
  let { userId, carId } = req.body;

  let userFromDB = await UserAndCars.findById(userId);

  let carToDeleteIndex = userFromDB.cars.findIndex(
    (car) => '' + car._id === '' + carId
  );

  // updating user data from DB  by removing car
  userFromDB.cars.splice(carToDeleteIndex, 1);

  UserAndCars.findByIdAndUpdate(userId, userFromDB).then((result) =>
    res.json(userFromDB)
  );
});

// PUT: Add single car to user based on his id
app.put('/api/cars/add/:id', async (req, res) => {
  let userId = req.params.id;
  let newCar = req.body;

  let userFromDB = await UserAndCars.findById(userId);
  userFromDB.cars.push(newCar);

  UserAndCars.findByIdAndUpdate(userId, userFromDB).then((result) =>
    res.json(userFromDB)
  );
});

// --------------------------------------------------------------------
// REST API
/*
GET:   /api/cars'             | Get all cars
       /api/users/:id         | Get single user based on id

POST:  /api/users/signup      | Register new user
       /api/users/login       | Log in existing user

PUT:   /api/cars/delete/:id   | Delete single car based on it's id
       /api/cars/add/:id      | Add single car to user based on his id
*/
//---------------------------------------------------------------------

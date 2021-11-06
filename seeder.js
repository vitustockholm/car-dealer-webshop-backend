import mongoose from 'mongoose';
import UserAndCars from './models/userAndCarsModel.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    let user = {
      name: 'John',
      surname: 'Smith',
      email: 'john@email.com',
      password: 'mypassword123',
      cars: [
        { make: 'Audi', model: 'A6', year: 2020, price: 40000 },
        { make: 'Audi', model: 'A5', year: 2017, price: 35000 },
        { make: 'Audi', model: 'A3', year: 2016, price: 32000 },
        { make: 'Audi', model: 'A5', year: 2019, price: 20000 },
        { make: 'Audi', model: 'A6', year: 2011, price: 5000 },
      ],
    };
    UserAndCars.deleteMany().then();

    UserAndCars.insertMany(user);

    console.log('Data sended to MongoDB');
  });

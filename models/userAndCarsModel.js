import mongoose from 'mongoose';
const { Schema } = mongoose;

const userAndCarsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cars: [
      {
        car_id: mongoose.Types.ObjectId,
        make: {
          type: String,
          required: true,
        },
        model: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const UserAndCars = mongoose.model('userandcars', userAndCarsSchema);
export default UserAndCars;

import mongoose from "mongoose";

const apartmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export const Apartment = mongoose.model("Apartment", apartmentSchema);

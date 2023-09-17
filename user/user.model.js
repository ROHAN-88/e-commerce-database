// import { date, string } from "joi";
import mongoose from "mongoose";
//setting rules
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: 5,
    maxlength: 55,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 55,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 55,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    enum: ["male", "female", "preferNotToSay"],
  },
  dob: {
    type: Date,
    required: true,
  },

  role: {
    type: String,
    required: true,
    trim: true,
    enum: ["buyer", "seller"],
  },
});

export const User = mongoose.model("User", userSchema);

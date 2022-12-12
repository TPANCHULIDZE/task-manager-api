const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    validate(value) {
      if(!validator.isEmail(value)){
        throw new Error('invalid email');
      }
    },
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true, 
    minlength: 6,
    validate(value) {
      if(value.includes('password')) {
        throw new Error('invalid password');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if(value < 0) {
        throw new Error('invalid age');
      }
    }
  }
});

module.exports = User;
const User = require("../../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "user1",
  email: "user1@test.ge",
  password: "testPassword",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_KEY),
    },
  ],
};
const userToken = "Bearer " + userOne.tokens[0].token;

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "user2",
  email: "user2@test.ge",
  password: "testPassword",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_KEY),
    },
  ],
};
const userTwoToken = "Bearer " + userTwo.tokens[0].token;

const taskOneId = new mongoose.Types.ObjectId();
const taskOne = {
  _id: taskOneId,
  description: "First task",
  completed: false,
  owner: userOneId,
};

const taskTwoId = new mongoose.Types.ObjectId();
const taskTwo = {
  _id: taskTwoId,
  description: "Second task",
  completed: true,
  owner: userOneId,
};

const taskThreeId = new mongoose.Types.ObjectId();
const taskThree = {
  _id: taskThreeId,
  description: "Third task",
  completed: false,
  owner: userTwoId,
};

const taskFourId = new mongoose.Types.ObjectId();
const taskFour = {
  _id: taskFourId,
  description: "Fourth task",
  completed: true,
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userTwo).save();
  await new User(userOne).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
  await new Task(taskFour).save();
};

module.exports = {
  userOneId,
  userOne,
  setupDatabase,
  userToken,
  userTwo,
  userTwoToken,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
};

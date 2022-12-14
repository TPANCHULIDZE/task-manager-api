const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { use } = require("../src/app");

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

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

it("Should sign up user success", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "tato",
      email: "tato@test.ge",
      password: "testPassword",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(user.password).not.toBe("testPassword");
  expect(response.body).toMatchObject({
    user: {
      name: "tato",
      email: "tato@test.ge",
    },
    token: user.tokens[0].token,
  });
});

it("Should sign in success", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);

  expect(response.body).toMatchObject({
    user: {
      name: userOne.name,
      email: userOne.email,
    },
    token: user.tokens[1].token,
  });
});

it("Should fail sign in when have invalid email", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "user@test.ge",
      password: "testPassword",
    })
    .expect(404);
});

it("Should access profile page success", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", "Bearer " + userOne.tokens[0].token)
    .expect(200);
});

it("Should fails access profile page with incorrect token", async () => {
  await request(app).get("/users/me").expect(401);
});

it("Should delete account successfully", async () => {
  const response = await request(app)
    .delete("/users")
    .set("Authorization", "Bearer " + userOne.tokens[0].token)
    .expect(200);

  const user = await User.findById(response.body.user._id);

  expect(user).toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: userOne.name,
      email: userOne.email,
    },
  });
});

it("Should delete account successfully", async () => {
  await request(app).delete("/users").expect(401);
});

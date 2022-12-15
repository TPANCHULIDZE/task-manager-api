const request = require("supertest");
const app = require("../src/app");
const User = require('../src/models/user');
const { userOne, userOneId, userToken, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

xit("Should sign up user success", async () => {
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

xit("Should sign in success", async () => {
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

xit("Should fail sign in when have invalid email", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "user@test.ge",
      password: "testPassword",
    })
    .expect(404);
});

xit("Should access profile page success", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", userToken)
    .expect(200);
});

xit("Should fails access profile page with incorrect token", async () => {
  await request(app).get("/users/me").expect(401);
});

xit("Should delete account successfully", async () => {
  const response = await request(app)
    .delete("/users")
    .set("Authorization", userToken)
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

xit("Should delete account successfully", async () => {
  await request(app).delete("/users").expect(401);
});

xit("Should upload avatar successfully", async () => {
  await request(app)
    .post('/users/me/avatar')
    .set("Authorization", userToken)
    .attach("avatar", "tests/fixtures/linux.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

xit("Should upload avatar successfully", async () => {
  await request(app)
    .post('/users/me/avatar')
    .set("Authorization", userToken)
    .attach("avatar", "tests/fixtures/chess-4.jpg")
    .expect(400);
});

xit('Should update valid user fields', async () => {
  await request(app).patch('/users').set('Authorization', userToken).send({
    name: 'update user'
  }).expect(200);

  const user = await User.findById(userOneId);

  expect(user.name).toBe('update user');
})

xit('Should update invalid user return 400', async () => {
  await request(app).patch('/users/me/avatar').set('Authorization', userToken).send({
    location: 'Kutaisi'
  }).expect(404);
})
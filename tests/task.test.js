const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  userOne,
  userOneId,
  setupDatabase,
  userToken,
  userTwo,
  taskOne,
  userTwoToken,
} = require("./fixtures/db");

beforeEach(setupDatabase);

it("Should create task successfully", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", userToken)
    .send({
      description: "task from test",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);

  expect(task).not.toBe(undefined);
  expect(task.description).toBe("task from test");
  expect(task.completed).toBe(false);
});

it("Should take userOne All tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", userToken)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

it("Should fails delete others task", async () => {
  await request(app)
    .delete("/tasks/" + taskOne._id)
    .set("Authorization", userTwoToken)
    .send()
    .expect(404)

  const task = await Task.findById(taskOne._id);

  expect(task).not.toBeNull();
});

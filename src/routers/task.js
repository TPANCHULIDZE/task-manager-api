const Task = require("../models/task");
const express = require("express");

const router = new express.Router();

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      res.status(404).send({ error: "task not found" });
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const infos = req.body;
  const updates = Object.keys(infos);
  const validKeys = ["description", "completed"];
  const isValidInfos = updates.every((update) => validKeys.includes(update));

  if (!isValidInfos) {
    return res.status(400).send({ error: "update info is invalid" });
  }
  try {
    const task = await Task.findByIdAndUpdate(id, infos, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }

    res.status(200).send({ task, message: "task delete successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

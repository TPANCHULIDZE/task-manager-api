const Task = require("../models/task");
const express = require("express");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const path = "tasks";
  const match = {};
  const sort = {};

  const options = {
    limit: parseInt(req.query.limit),
    skip: parseInt(req.query.skip),
  };

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    options.sort = sort;
  }

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  try {
    await req.user.populate({
      path,
      match,
      options,
    });
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const infos = req.body;
  const updates = Object.keys(infos);
  const validKeys = ["description", "completed"];
  const isValidInfos = updates.every((update) => validKeys.includes(update));

  if (!isValidInfos) {
    return res.status(400).send({ error: "update info is invalid" });
  }
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }

    await task.delete();

    res.status(200).send({ task, message: "task delete successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;

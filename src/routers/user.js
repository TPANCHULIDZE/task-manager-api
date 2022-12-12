const User = require("../models/user");
const express = require("express");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      res.status(404).send({ error: "user not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch("/users/:id", async (req, res) => {
  const info = req.body;
  const updates = Object.keys(info);
  const validKeys = ["name", "email", "password", "age"];
  const isValidInfos = updates.every((update) => validKeys.includes(update));

  if (!isValidInfos) {
    return res.status(400).send({ error: "invalid info" });
  }

  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send({ error: "user  not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ error: "user not found" });
    }

    res.status(200).send({ user, message: "User delete successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

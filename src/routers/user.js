const User = require("../models/user");
const express = require("express");
const auth = require('../middleware/auth');

const router = new express.Router();


router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try{
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    
    const token = await user.generateAuthToken();
    

    res.status(200).send({user, token});
  } catch(error) {
    res.status(404).send({error: error.message});
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);

    await req.user.save();
    res.status(200).send({message: 'sign out successfully'});
  } catch(error) {
    res.status(400).send({message: "logout failed"});
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.status(200).send({message: 'sign out successfully'});
  } catch(error) {
    res.status(500).send(error);
  }
}),

router.get("/users/me", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});


// router.get("/users/:id",  auth, async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);

//     if (!user) {
//       res.status(404).send({ error: "user not found" });
//     }

//     res.status(200).send(user);
//   } catch (error) {
//     res.status(404).send(error);
//   }
// });

router.patch("/users", auth, async (req, res) => {
  const info = req.body;
  const updates = Object.keys(info);
  const validKeys = ["name", "email", "password", "age"];
  const isValidInfos = updates.every((update) => validKeys.includes(update));

  if (!isValidInfos) {
    return res.status(400).send({ error: "invalid info" });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    
    await req.user.save();
    
    if (!user) {
      return res.status(404).send({ error: "user  not found" });
    }

    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users", auth, async (req, res) => {
  const id = req.params.id;

  try {
    await req.user.remove();

    res.status(200).send({ user: req.user, message: "User delete successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

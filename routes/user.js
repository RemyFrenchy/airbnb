const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encbase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

//La route "/user/sign_up" permettra de créer un nouvel utilisateur en BDD.
router.post("/user/sign_up", async (req, res) => {
  try {
    const { email, password, username, name, description } = req.fields;

    if (email && password && username && name && description) {
      const checkExistingEmail = await User.findOne({ email: email });
      const checkExistingUsername = await User.findOne({ username: username });

      if (!checkExistingUsername && !checkExistingEmail) {
        // Générer le salt
        const salt = uid2(64);
        // Générer le hash
        const hash = SHA256(password + salt).toString(encbase64);
        // Générer le token
        const token = uid2(64);
        console.log(token);

        //Nouvel utilisateur
        const newUser = new User({
          email: email,
          token: token,
          salt: salt,
          hash: hash,
          username: username,
          name: name,
          description: description,
        });

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          token: newUser.token,
          email: newUser.email,
          username: newUser.username,
          description: newUser.description,
          name: newUser.name,
        });
      } else {
        res
          .status(400)
          .json("an account with this Email or username already exsist");
      }
    } else {
      res.status(400).json("missing parameters");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//La route "/user/log_in" permettra à l'utilisateur de se connecter.
router.post("/user/log_in", async (req, res) => {
  try {
    const { email, password } = req.fields;

    if (email && password) {
      const user = await User.findOne({ email: email });
      console.log(user);
      if (user) {
        const newHash = SHA256(password + user.salt).toString(encbase64);
        console.log(newHash);
        if (newHash === user.hash) {
          res.status(200).json({
            _id: user._id,
            token: user.token,
            email: user.email,
            username: user.username,
            description: user.description,
            name: user.name,
          });
        } else {
          res.status(400).json("wrong password");
        }
      } else {
        res.status(400).json("email does not exsist");
      }
    } else {
      res.status(400).json("email or password missing");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

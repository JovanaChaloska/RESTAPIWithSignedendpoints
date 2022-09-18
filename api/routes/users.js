const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken');

const publicKey = fs.readFileSync(path.join(__dirname, 'keys', 'rsa.key.pub'), 'utf8');

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail already signed up!"
        });
      } else {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email
          });
        user.setPassword(req.body.password);
        user.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "User created"
                });
              })
              .catch(error => {
                console.log(error);
                res.status(500).json({
                  error: error
                });
              });
      }
    });
});

router.post("/login", (req, res, next) => {
    User.findOne({ email : req.body.email }, function(error, user) { 
        if (user === null) { 
            return res.status(401).send({ 
                message : "Auth failed!"
            }); 
        } 
        else { 
            if (user.validPassword(req.body.password)) { 
                const token = jwt.sign({email : user.email, _id : user._id}, "abc123", {algorithm: "HS512", expiresIn : "2h"});
                return res.status(201).send({ 
                    message : "User Logged In", 
                    token: token,
                    publicKey: publicKey
                }) 
            } 
            else { 
                return res.status(401).send({ 
                    message : "Auth failed!"
                }); 
            } 
        } 
    }); 
  });

module.exports = router;

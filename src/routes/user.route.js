import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { user } from "../models/user.models.js";
import checkAuth from '../middlewares/check-auth.js';

const router = express.Router();

router.post("/signup", (req, res, next) => {
  user
    .find({ email: req.body.email })
    .exec()
    .then((existingUsers) => {
      if (existingUsers.length > 0) {
        return res.status(409).json({
          message: "Email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const newUser = new user({
              _id: new mongoose.Types.ObjectId(),
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              password: hash,
              number: req.body.number,
            });
            newUser
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created",
                  user: result,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/login", (req, res, next) => {
  user
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          messge: "user not exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            messge: "password not matched",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              first_name: user[0].first_name,
              email: user[0].email,
              last_name: user[0].last_name,
            },
            "this is dummy text",
            { expiresIn: "24h" }
          );
          res.status(200).json({
            _id: user[0]._id,
            first_name: user[0].first_name,
            email: user[0].email,
            last_name: user[0].last_name,
            number: user[0].number,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
export default router;

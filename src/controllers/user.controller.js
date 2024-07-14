import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { user } from "../models/user.models.js";
import { OtpCode } from "../models/otp.model.js";
import crypto from "crypto";
import transporter from '../config/transporter.js';
import { otpVerificationEmail } from '../template/otpTemplates.js';



function generateToken() {
  return crypto.randomBytes(3).toString("hex"); // Example token generation
}
const sendEmail = async (receiverEmail, emailTemplate) => {
  const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: receiverEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.body,
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
  } catch (error) {
      console.error("Error occurred while sending email:", error);
  }
};

export const signup = (req, res) => {
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
};

export const login = (req, res) => {
  user
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User not exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            message: "Password not matched",
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
            favourites:user[0].favourites,
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
};

export const getUsers = async (req, res) => {
  try {
    const users = await user.find().exec();
    res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const foundUser = await user.findById(userId).exec();

    if (!foundUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: foundUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};


export const sentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const User = await user.find({ email }).exec();

    // Check if user exists
    if (User.length < 1) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = generateToken();

    const otpCodeLog = new OtpCode({
      _id: new mongoose.Types.ObjectId(),
      user_id: User[0]._id,
      email: email,
      code: otp,
    });

    await otpCodeLog.save();

     res.status(200).json({
      
      message: `6 digit code sent to ${email}`,
      // codelog: otpCodeLog,
    });
    if (res.statusCode === 200) {
      const otpTemplate = otpVerificationEmail(User[0].first_name,otp);
      await sendEmail(email, otpTemplate);
    }
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
};

export const otpVerification = async (req, res) => {
  try {
    let otpCodeLog = await OtpCode.find({ email: req.body.email }).exec();

    if (otpCodeLog.length === 0) {
      return res.status(404).json({
        message: "No OTP found for this email",
      });
    }

    let latestOtpCode = otpCodeLog[otpCodeLog.length - 1].code; // Get the latest OTP code
    let otpCreatedAt = new Date(otpCodeLog[otpCodeLog.length - 1].createdAt); // Get the creation time of the latest OTP
    let currentDateTime = new Date();

    console.log("Database OTP:", latestOtpCode);
    console.log("Database OTP Created At:", otpCreatedAt.toISOString());
    console.log("User OTP:", req.body.otp);
    console.log("Current Time:", currentDateTime.toISOString());

    let diffInMinutes = Math.abs(currentDateTime - otpCreatedAt) / (1000 * 60);

    if (diffInMinutes > 2) {
      console.log("OTP expired. Resend code.");
      return res.status(200).json({
        message: "Your OTP has expired. Please request a new OTP.",
      });
    } else {
      if (latestOtpCode.toString() === req.body.otp.toString()) {
        console.log("Matched");
        return res.status(200).json({
          message: "OTP matched successfully",
        });
      } else {
        console.log("Not Matched");
        return res.status(200).json({
          message: "OTP does not match",
        });
      }
    }
  } catch (err) {
    console.error("Error in otpVerification:", err);
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
};


export const updatePassword = (req, res) => {
  user
    .findOne({ email: req.body.email })
    .exec()
    .then((existingUser) => {
      if (!existingUser) {
        return res.status(404).json({
          message: "User not Found",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            existingUser.password = hash;
            existingUser
              .save()
              .then((result) => {
                res.status(200).json({
                  message: "Password updated successfully",
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
};
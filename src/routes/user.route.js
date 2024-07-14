import express from "express";
import checkAuth from '../middlewares/check-auth.js';
import { signup, login, getUsers, getUserById ,sentOtp,otpVerification,updatePassword} from '../controllers/user.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/", checkAuth, getUsers);
router.get("/:id", checkAuth, getUserById);
router.post("/sentOtp", sentOtp);
router.post("/verifyOtp", otpVerification);
router.patch("/updatePassword", updatePassword);

export default router;

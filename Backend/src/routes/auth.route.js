import express from "express";
import { login, logout, signup, updateProfile, checkAuth, updateName, updateEmail, updateUsername, changePassword, forgotPassword, getOtp } from "../controllers/auth.controller.js";
// import passport from "passport";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/updateProfile", protectRoute, updateProfile);  // Protect (middleware) is used to check the condition before going to the route

router.get("/check", protectRoute, checkAuth);  // user stay logged in even after refreshing the page

router.put("/updateName", protectRoute, updateName);  

router.put("/updateEmail", protectRoute, updateEmail); 

router.put("/updateUsername", protectRoute, updateUsername); 

router.put("/changePassword", protectRoute, changePassword);

router.post("/getOtp", getOtp);
router.put("/forgotPassword", forgotPassword);

// Google auth
// router.get("/login/success", (req, res) => {
// 	if (req.user) {
// 		res.status(200).json({
// 			error: false,
// 			message: "Successfully Loged In",
// 			user: req.user,
// 		});
// 	} else {
// 		res.status(403).json({ error: true, message: "Not Authorized" });
// 	}
// });

// router.get("/login/failed", (req, res) => {
// 	res.status(401).json({
// 		error: true,
// 		message: "Log in failure",
// 	});
// });

// router.get("/google", passport.authenticate("google", ["profile", "email"]));

// router.get(
// 	"/google/callback",
// 	passport.authenticate("google", {
// 		successRedirect: process.env.CLIENT_URL,
// 		failureRedirect: "/login/failed",
// 	})
// );

// router.get("/logout", (req, res) => {
// 	req.logout();
// 	res.redirect(process.env.CLIENT_URL);
// });

export default router;

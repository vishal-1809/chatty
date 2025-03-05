import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import isFollowed from "../middleware/isFollowed.middleware.js"
import { getUsersforOthers, countPost, countFollower, countFollowing, follow, unfollow, followingList, followerList, userDetails, othersFollowing, othersFollowers, notFollowingList, isFollow } from "../controllers/profileInfo.controller.js";

const router = express.Router();

router.post("/getUsersforOthers", protectRoute, isFollowed, getUsersforOthers);

router.get('/numberOfPost', protectRoute, countPost);
router.get('/numberOfFollowers', protectRoute, countFollower);
router.get('/numberOfFollowing', protectRoute, countFollowing);
router.post('/userDetails', protectRoute, userDetails);

router.put('/follow', protectRoute, follow); 
router.put('/unfollow', protectRoute, unfollow); 
router.post('/isFollow', protectRoute, isFollow); 
router.get('/followingList', protectRoute, followingList); 
router.get('/followerList', protectRoute, followerList); 
router.get('/notFollowingList', protectRoute, notFollowingList);

router.post('/othersFollowingList', protectRoute, isFollowed, othersFollowing);
router.post('/othersFollowersList', protectRoute, isFollowed, othersFollowers);


export default router;
import express from "express";
import { deletePost, dislike, getPosts, getPostsbyUser, like, likeList, posts, viewProfile } from "../controllers/post.controller.js";
import protectRoute from "../middleware/auth.middleware.js";
import isFollowed from "../middleware/isFollowed.middleware.js"


const router = express.Router();

router.put('/post', protectRoute, posts);
router.put('/likePost/:id', protectRoute, like);
router.put('/dislikePost/:id', protectRoute, dislike);
router.post('/likeList/', protectRoute, likeList);

router.get('/getPost', protectRoute, getPosts);
router.post('/getPostsbyUser', protectRoute, isFollowed, getPostsbyUser);
router.post('/viewProfile', protectRoute, viewProfile);

router.delete('/deletePost/:postId', protectRoute, deletePost);



export default router;

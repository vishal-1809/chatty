import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const isFollowed = async (req, res, next) => {
    try {
        const username = req.body.userName;
        const currUser = req.user;
        if(currUser.userName.toString() === username.toString()) {
            next();
            return;
        }
        const isFollow = await User.findOne({
            _id: currUser._id,
            following: { $elemMatch: { $eq: username } },
          });

        if(!isFollow) {
            return res.status(401).json({message: "You're not allowed to view this section of this profile"});
            // return;
        }
        // return res.status(200).json({message: "Successful"});
        next();
    } catch (error) {
        console.log("Error in isFollowed Middleware", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default isFollowed;
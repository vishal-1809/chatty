import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({message: "Unauthorized access: User is not Logged In"});
        }
        else {
            // const decoded = "abc";
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // will contain the user detail
            if(!decoded) {
                return res.status(401).json({message: "Unauthorized access: Token is not valid"});
            }
            const user = await User.findById(decoded.userId).select("-password");
            if(!user){
                return res.status(404).json({message: "User not found"});
            }

            req.user =  user;

            next(); // calling the nextfunction of updateProfile
        }
    } catch (error) {
        console.log("Error in ProtectRoute middleware", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default protectRoute;

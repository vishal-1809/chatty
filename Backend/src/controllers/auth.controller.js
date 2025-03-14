import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


export const signup = async (req, res) => {
    const { email, fullName, userName, password } = req.body;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    try {
        // Check all the fields
        if (!fullName || !email || !password || !userName) {
            return res.status(400).json({ message: "All the fields are required" });
        }

        // Email
        const emailId = await User.findOne({ email: email.toLowerCase() });
        if (emailId) {
            return res.status(400).json({ message: "Email is already registered" });
        }



        // Username
        const name = await User.findOne({ userName });
        if (name) {
            return res.status(400).json({ message: "Username already taken by someone" });
        }
        else if (userName.includes(" ")) {
            return res.status(400).json({ message: "Username must not contain spaces" });
        }
        else if (specialCharPattern.test(userName)) {
            return res.status(400).json({ message: "Username must not contains special characters" });
        }



        // Password
        let hashedPassword;
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 character" });
        }
        else {
            let caps = 0, special = 0, small = 0, number = 0;
            for (let i = 0; i < password.length; i++) {
                if (password[i] >= 'a' && password[i] <= 'z') small++;
                else if (password[i] >= 'A' && password[i] <= 'Z') caps++;
                else if (password[i] >= '0' && password[i] <= '9') number++;
                else special++;
            }
            if (caps && special && small && number) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            }
            else {
                // Capital letter
                if (!caps) {
                    return res.status(400).json({ message: "Password must contains at least one capital letter" });
                }
                // Special Character
                if (!special) {
                    return res.status(400).json({ message: "Password must contains at least one special character" });
                }
                // Small letter
                if (!small) {
                    return res.status(400).json({ message: "Password must contains at least one small letter" });
                }
                // Number
                if (!number) {
                    return res.status(400).json({ message: "Password must contains at least one number" });
                }
            }
        }


        // list of non following users
        const notFollowing = await User.find().select("userName following -_id").lean();

        // NewUser for adding after checking all the cases
        const newUser = User({
            fullName,
            email: email.toLowerCase(),
            userName,
            password: hashedPassword,
            notFollowing: notFollowing.map(user => user.userName),
        });

        // Update others non following list
        const others = await User.find().select("_id notFollowing").lean();
        for (let i = 0; i < others.length; i++) {
            let a = await User.findByIdAndUpdate(
                others[i]._id,
                { notFollowing: [...others[i].notFollowing, userName] },
            );
        }



        if (newUser) {
            // Token generation and cookie storage
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt
            });
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }


    } catch (error) {
        console.log("Error in signup controller", error);
        res.send(500).json({ message: "Internal Server Error" });
    }
}



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email) {
            return res.status(400).json({ message: "Email ID is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        // Email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email is not registered" });
        }
        else {
            if (!password) {
                return res.status(400).json({ message: "Password is required" });
            }

            // Password check
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Password is Incorrect" });
            }
            else {
                generateToken(user._id, res);
                res.status(200).json({
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    userName: user.userName,
                    profilePic: user.profilePic,
                    createdAt: user.createdAt,
                });
            }
        }

    } catch (error) {
        console.log("Error while login", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logout Successfully" });

    } catch (error) {
        console.log("Error while logging out", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true },
        );

        const inPostModel = await Post.updateMany(
            { userId: userId },
            { $set: { profilePic: uploadResponse.secure_url } }
        );

        const otherinPostModel = await Post.updateMany(
            { "likes.userId": userId },  // Find posts where likes array contains the userId
            { $set: { "likes.$[elem].profilePhoto": uploadResponse.secure_url } }, // Update profilePhoto inside likes array
            { arrayFilters: [{ "elem.userId": userId }] } // Filter to update only matching userId inside likes
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile picture", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error while checking", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



export const updateEmail = async (req, res) => {
    try {
        const userId = req.user._id;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email ID is required" });
        }

        const checkEmail = await User.findOne({ email: email.toLowerCase(), _id: { $ne: userId } });
        if (checkEmail) {
            return res.status(400).json({ message: "Email is already registered with another username" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { email: email.toLowerCase() },
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in updating email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const updateName = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName } = req.body;

        if (!fullName) {
            return res.status(400).json({ message: "Full Name is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName: fullName },
            { new: true }
        );

        const inPostModel = await Post.updateMany(
            { userId: userId },
            { $set: { fullName: fullName } }
        );

        const otherinPostModel = await Post.updateMany(
            { "likes.userId": userId },  // Find posts where likes array contains the userId
            { $set: { "likes.$[elem].fullName": fullName } }, // Update profilePhoto inside likes array
            { arrayFilters: [{ "elem.userId": userId }] } // Filter to update only matching userId inside likes
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in updating name:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const updateUsername = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentUsername = req.user.userName;
        const { userName } = req.body;
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

        if (!userName) {
            return res.status(400).json({ message: "Username is required" });
        }
        else if (userName.includes(" ")) {
            return res.status(400).json({ message: "Username must not contain spaces" });
        }
        else if (specialCharPattern.test(userName)) {
            return res.status(400).json({ message: "Username must not contains special characters" });
        }

        const checkUsername = await User.findOne({ userName: userName, _id: { $ne: userId } });
        if (checkUsername) {
            return res.status(400).json({ message: "Username is already registered with another email" });
        }

        // update this username for others as well
        // const user = await User.find({ _id: { $ne: userId } }).select("-password").lean();
        const user = await User.find().select("_id followers following notFollowing").lean();

        for (let i = 0; i < user.length; i++) {
            let x = user[i].followers.map(name => name === currentUsername ? userName : name);
            let y = user[i].following.map(name => name === currentUsername ? userName : name);
            let z = user[i].notFollowing.map(name => name === currentUsername ? userName : name);
            let a = await User.findByIdAndUpdate(
                user[i]._id,
                {
                    followers: x,
                    following: y,
                    notFollowing: z
                },
                { new: true } // Ensure updated document is returned
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userName: userName },
            { new: true }
        );

        const inPostModel = await Post.updateMany(
            { userId: userId },
            { $set: { userName: userName } }
        );

        const otherinPostModel = await Post.updateMany(
            { "likes.userId": userId },  // Find posts where likes array contains the userId
            { $set: { "likes.$[elem].userName": userName } }, // Update profilePhoto inside likes array
            { arrayFilters: [{ "elem.userId": userId }] } // Filter to update only matching userId inside likes
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in updating username:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const changePassword = async (req, res) => {
    try {
        const id = req.user._id;
        const oldPassword = req.body.oldPassword;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        const user = await User.findById(id).select("password");

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({ message: "Old Password is Incorrect!" });
        }

        if (confirmPassword !== password) {
            return res.status(400).json({ message: "New Password and Confirm Password should be same" });
        }

        const isPasswordSame = await bcrypt.compare(password, user.password);
        if (isPasswordSame) {
            return res.status(400).json({ message: "Old Password and New Password cannot be same!" });
        }

        let hashedPassword;
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 character" });
        }
        else {
            let caps = 0, special = 0, small = 0, number = 0;
            for (let i = 0; i < password.length; i++) {
                if (password[i] >= 'a' && password[i] <= 'z') small++;
                else if (password[i] >= 'A' && password[i] <= 'Z') caps++;
                else if (password[i] >= '0' && password[i] <= '9') number++;
                else special++;
            }
            if (caps && special && small && number) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            }
            else {
                // Capital letter
                if (!caps) {
                    return res.status(400).json({ message: "Password must contains at least one capital letter" });
                }
                // Special Character
                if (!special) {
                    return res.status(400).json({ message: "Password must contains at least one special character" });
                }
                // Small letter
                if (!small) {
                    return res.status(400).json({ message: "Password must contains at least one small letter" });
                }
                // Number
                if (!number) {
                    return res.status(400).json({ message: "Password must contains at least one number" });
                }
            }
        }

        const result = await User.findByIdAndUpdate(
            user._id,
            {
                password: hashedPassword,
            }
        );

        return res.status(200).json(result);

    } catch (error) {
        console.log("error in changePassword function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const getOtp = async (req, res) => {
    try {
        const userName = req.body.userName;
        const result = await User.findOne({ userName: userName });
        if (!result) {
            return res.status(400).json({ message: "Username is not registered" });
        }
        const email = result.email;

        // OTP Generate Logic function logic
        const otp = Math.floor(Math.random() * 9000) + 1000;

        // Otp Sending Logic now in frontend
        // let testAccount = await nodemailer.createTestAccount();

        // connect with the smtp
        // let transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: 'not_set_yet',
        //         pass: 'not_set_yet'
        //     }
        //   });

        // let info = await transporter.sendMail({
        //     from: 'chatter@chatty.com', // sender address
        //     to: email, // list of receivers
        //     subject: `${otp} OTP`, // Subject linex
        //     text: `${otp} OTP`, // plain text body
        //     html: `<b>OTP: ${otp} to reset your password.</b>`, // html body
        // });


        const [localPart, domain] = email.split('@');

        // Get the first 2 characters and replace the rest with 'X'
        const maskedLocalPart = localPart.slice(0, 2) + 'X'.repeat(localPart.length - 2);

        // Construct the final masked email
        const maskedEmail = maskedLocalPart + '@' + domain;

        return res.status(200).json({ message: `OTP sent on your registered email address: ${maskedEmail}`, otp: otp, email: email });

    } catch (error) {
        console.log("error in forgotPassword function:", error);
        res.status(500).json({ message: "Internal server error, Contact with vy34365@gmail.com" });
    }
}



export const forgotPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const userName = req.body.userName;

        const user = await User.findOne({ userName: userName });

        if (confirmPassword !== password) {
            return res.status(400).json({ message: "New Password and Confirm Password should be same" });
        }

        let hashedPassword;
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 character" });
        }
        else {
            let caps = 0, special = 0, small = 0, number = 0;
            for (let i = 0; i < password.length; i++) {
                if (password[i] >= 'a' && password[i] <= 'z') small++;
                else if (password[i] >= 'A' && password[i] <= 'Z') caps++;
                else if (password[i] >= '0' && password[i] <= '9') number++;
                else special++;
            }
            if (caps && special && small && number) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            }
            else {
                // Capital letter
                if (!caps) {
                    return res.status(400).json({ message: "Password must contains at least one capital letter" });
                }
                // Special Character
                if (!special) {
                    return res.status(400).json({ message: "Password must contains at least one special character" });
                }
                // Small letter
                if (!small) {
                    return res.status(400).json({ message: "Password must contains at least one small letter" });
                }
                // Number
                if (!number) {
                    return res.status(400).json({ message: "Password must contains at least one number" });
                }
            }
        }

        const result = await User.findByIdAndUpdate(
            user._id,
            {
                password: hashedPassword,
            }
        );

        return res.status(200).json(result);

    } catch (error) {
        console.log("error in forgotPassword function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
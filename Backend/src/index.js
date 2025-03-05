import express, { request } from "express";
import cors from "cors";
// import passport from "passport";
import cookieParser from "cookie-parser";
// import cookieSession from "cookie-session";
import authRoutes from "./routes/auth.route.js";
import profileInfo from "./routes/profileInfo.route.js"
import messageRoutes from "./routes/message.route.js";
import post from "./routes/post.route.js";
import dotenv from "dotenv";

import path from "path";

// import passportStrategy from "./passport.js";
import connectDB from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// const app = express();

// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );
// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/profileInfo", profileInfo);
app.use("/api/posting", post);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT;
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
    });
  }

server.listen(PORT, () => {
    console.log("server is listening on "+ PORT);
    connectDB();
});



// Note:
// req.body -- Taking from the body of the request
// req.name -- Taking from the middleware
// req.params -- Taking parameter from the api

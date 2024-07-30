import express from "express";
import dotenv from "dotenv"
import path from "path"
import cookieParser from "cookie-parser";
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js"
import postRoutes from "../routes/post.routes.js"
import notificationRoutes from "../routes/notification.routes.js"
import connectDB from "../db/connectDB.js";
import {v2 as cloudinary} from "cloudinary";
import cors from "cors"
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({limit:"20mb"}))
app.use(express.urlencoded({extended:true}))
app.use(cors(
    {
        origin: "https://social-ackend-imvo.vercel.app/"
    }
));
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)
app.get("/api/", (req, res)=>{
    res.send("Hello from server");
}
)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}


export  default app
import {v2 as cloudinay} from "cloudinary";
import {config} from "dotenv";

config();

cloudinay.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export default cloudinay;
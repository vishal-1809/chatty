import crypto from "crypto";
// import { Buffer } from "node:buffer";


const algorithm = "aes-256-cbc"; // Encryption algorithm
const secretKey = crypto.createHash("sha256").update(process.env.ENCRYPTION_KEY).digest("base64").substring(0, 32); // Ensure 32-byte key
const iv = crypto.randomBytes(16); // Initialization vector (16 bytes)

// Encrypt the message
export const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, "utf8"), iv);
    // const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { 
        iv: iv.toString("hex"),
        encryptedData: encrypted,
    };
};

// Decrypt the message
export const decrypt = (encryption) => {
    // console.log("reached here", encryption)
    // const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, "utf8"), Buffer.from(encryption.iv, "hex"));
    // let decrypted = decipher.update(encryption.encryptedData, "hex", "utf8");
    // decrypted += decipher.final("utf8");
    // return decrypted;

    try {
        const algorithm = "aes-256-cbc"; // Example algorithm; replace with your actual algorithm

        // Validate input
        if (!encryption || !encryption.iv || !encryption.encryptedData) {
            throw new Error("Invalid encryption object. Ensure iv and encryptedData are provided.");
        }


        // Debugging logs
        // console.log("IV:", encryption.iv);
        // console.log("Encrypted Data:", encryption.encryptedData);
        // console.log("Secret Key:", secretKey);

        // Create decipher
        const decipher = crypto.createDecipheriv(
            algorithm,
            Buffer.from(secretKey, "utf8"),
            // Buffer.from(secretKey),
            Buffer.from(encryption.iv, "hex")
        );

        // Decrypt
        let decrypted = decipher.update(encryption.encryptedData, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        console.error("Error in decryption:", error.message);
        throw error;
    }
};



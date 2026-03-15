import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String
    }
});

export default mongoose.model("User", userSchema);
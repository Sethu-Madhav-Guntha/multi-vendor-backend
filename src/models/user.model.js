import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["Admin", "User", "Vendor"],
        default: "User"
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    profileImg: {
        type: String,
        default: function () {
            // ✅ Default based on gender
            if (this.gender === "Male") {
                return "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&w=740&q=80";
            } else if (this.gender === "Female") {
                return "https://frijotech.com/media/users/1727168968272_f6pvVap.jpg";
            }
        },
        set: function (value) {
            return value === "" ? undefined : value; // forces default if empty string
        }
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
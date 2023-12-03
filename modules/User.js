import mongoose from "mongoose"

const UserScheme = new mongoose.Schema(
    {
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('UserScheme', UserScheme)

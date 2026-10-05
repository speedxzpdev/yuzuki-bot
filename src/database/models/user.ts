import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "Isn't defined"},
    user_id: { type: String, required: true, unique: true, immutable: true },
    stars: { type: Number, default: 0},
    language: { type: String, default: "en"},
    create_at: { type: Date, default: Date.now}
});

export const user = mongoose.model("users", userSchema);
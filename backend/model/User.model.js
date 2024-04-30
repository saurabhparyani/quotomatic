import { Schema, model } from "mongoose"

const likeSchema = new Schema({
    quotation: String,
    author: String,
    image: String,
    imageSize: {
        height: Number,
        width: Number
    }
})

const userSchema = new Schema({
    userId: { type: String, unique: true },
    likes: [likeSchema]
})

export default model("User", userSchema)
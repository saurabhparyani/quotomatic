import express, { json } from 'express';
import { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";

const likeRouter = require("./routes/like.router")

const MONG0_URL = process.env.MONGODB_ATLAS_URL

connect(MONG0_URL)
    .then(() => console.log("Database connected successfully!"));

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors())
app.use(json());

app.use("/likes", likeRouter)

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const port = process.env.PORT;

app.use("/auth", authRouter);

app.listen(port, () => {
    console.log(`Server is Listening at Port: ${port}`);
})
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./src/routes/auth.route.js";
import storeRouter from "./src/routes/store.route.js";
import productRouter from "./src/routes/product.route.js";
import cartRouter from "./src/routes/cart.route.js";
import orderRouter from "./src/routes/order.route.js";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middlewares/err.middleware.js";
import { isCustomer, isVendor } from "./src/middlewares/auth.middleware.js";
import { swaggerSpec, swaggerUi } from "./src/config/swagger.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
dotenv.config();
connectDB();

const PORT = process.env.PORT;

app.use("/auth", authRouter);
app.use("/stores", isVendor, storeRouter);
app.use("/products", productRouter);
app.use("/cart", isCustomer, cartRouter);
app.use("/orders", orderRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is Listening at Port: ${PORT}`);
})
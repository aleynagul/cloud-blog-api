import express from "express";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("src/public"));


app.use("/posts", postRoutes);
app.use("/auth", authRoutes);


export default app;

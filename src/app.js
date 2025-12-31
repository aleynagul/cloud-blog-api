import express from "express";
import postRoutes from "./routes/post.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", postRoutes);

export default app;

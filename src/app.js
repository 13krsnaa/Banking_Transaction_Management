const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");

const app = express();

//jis bhi user ki request /api/auth par aayegi vo "authRouter" ke andar jayegi or aage ka kaam auth.routes.js file ke according hoga
app.use("/api/auth", authRouter);
app.use(express.json());
app.use(cookieParser());

module.exports = app;

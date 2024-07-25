import Express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

import indexRouter from "./routes/index";
import playerRouter from "./routes/player";
import leaderboardRouter from "./routes/leaderboard";
import playersRouter from "./routes/players";
import steamRouter from "./routes/auth/steam";

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Express.static(path.join(__dirname, 'public')));
dotenv.config();

app.use('/', indexRouter);
app.use("/player", playerRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/players", playersRouter);
app.use("/auth/steam", steamRouter)

module.exports = app;
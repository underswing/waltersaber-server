import Express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

import indexRouter from "./routes/index";
import playerRouter from "./routes/player";
import leaderboardRouter from "./routes/leaderboard";
import playersRouter from "./routes/players";
import steamAuthRouter from "./routes/auth/steam";
import session from "express-session";
import passport from "passport";
import {Strategy as SteamStrategy} from "passport-steam";

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Express.static(path.join(__dirname, 'public')));
dotenv.config();
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new SteamStrategy({
    returnURL: `http://localhost:${process.env.PORT || 3000}/auth/steam/return`,
    realm: `http://localhost:${process.env.PORT || 3000}/`,
    apiKey: process.env.STEAM_API_KEY as string
}, function (_identifier, profile, done) {
    return done(null, profile);
}));

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done: (err: any, user?: any) => void) => {
    done(null, obj);
});

app.use('/', indexRouter);
app.use("/player", playerRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/players", playersRouter);
app.use("/auth/steam", steamAuthRouter);

module.exports = app;
import passport from "passport";
import Express from "express";

const router = Express.Router();

router.get("/", (req, res, next) => {
    if (req.isAuthenticated()) res.redirect("/profile");
    else passport.authenticate("steam")(req, res, next);
});

router.get("/return", passport.authenticate("steam", { failureRedirect: "/" }), (_req, res) => {
    res.redirect("/profile");
});

export default router;
import Express, {NextFunction, Request, Response} from "express";
const router = Express.Router();

router.get('/', function(_req: Request, res: Response) {
    res.status(200).send("Allo");
});

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('User not authenticated');
}

router.get('/profile', isAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

router.get('/logout', (req, res) => {
    req.logout((err: any) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/');
    });
});

export default router;
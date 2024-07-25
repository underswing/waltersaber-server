import Express, {Request, Response} from "express";
const router = Express.Router();

router.get('/', (_req: Request, res: Response) => {
    res.status(200).send("Allo");
});

export default router;
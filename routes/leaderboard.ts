import Express, {Request, Response} from "express";
import { PrismaClient } from '@prisma/client';

const router = Express.Router();
const prisma = new PrismaClient();

router.post("/", async(req: Request, res: Response) => {
    const id = req.body.id;
    if(typeof id !== "string") return res.status(400).send("Please provide a valid id!");

    const profile = await prisma.player.findUnique({
        where: {
            id: id
        }
    });

    if(profile === null) return res.status(404).send("Profile not found!");

    return res.status(200).json(profile);
});

export default router;
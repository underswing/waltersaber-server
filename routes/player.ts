import Express, {Request, Response} from "express";
import { PrismaClient } from '@prisma/client';
import { genProfileId } from "../util/cuidGen";

const router = Express.Router();
const prisma = new PrismaClient();

router.get("/:id", async(req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if(id === undefined) return res.status(400).send("Please provide a valid id!");

        const profile = await prisma.player.findUnique({
            where: {
                id: id
            }
        });

        if(profile === null) return res.status(404).send("Profile not found!");

        return res.status(200).json(profile);
    } catch(err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
});

router.post('/create', async (req: Request, res: Response) => {
    try {
        const name = req.body.name;
        const steamId = req.body.steamId;
        if(typeof name !== "string") return res.status(400).send("Error! Please provide a valid name!");
        if(typeof steamId !== "string") return res.status(400).send("Error! Please provide a valid steamId!");

        const lowestRank = await prisma.player.count() + 1;
        const profile = await prisma.player.create({
            data: {
                id: genProfileId(),
                name: name,
                rank: lowestRank,
                steamId: steamId
            }
        });
        return res.status(200).json(profile);
    } catch(err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
});

export default router;
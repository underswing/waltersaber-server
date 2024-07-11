import Express, {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const router = Express.Router();
const prisma = new PrismaClient();

router.get("/", async(req: Request, res: Response) => {
    try {
        const _c = parseInt(req.query.count as string);
        const _p = parseInt(req.query.page as string);

        const count = !isNaN(_c) ? _c : 50;
        const page = !isNaN(_p) ? _p : 1;

        if(count <= 0 || count <= 0) return res.status(400).send("Please enter a valid page/count!");

        const players = await prisma.player.findMany({
            orderBy: [
                {rank: "asc"}
            ],
            skip: (page - 1) * count,
            take: count
        });

        return res.status(200).json(players);
    } catch(err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
});

export default router;
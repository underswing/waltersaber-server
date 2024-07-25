import Express, {Request, Response} from "express";
import { PrismaClient } from '@prisma/client';
import { genProfileId } from "../util/cuidGen";
import {authenticateUser} from "./auth/steam";

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

router.get("/steam/:steamId", async(req: Request, res: Response) => {
    try {
        const id = req.params.steamId;
        if(id === undefined) return res.status(400).send("Please provide a valid id!");

        const player = await prisma.player.findFirst({
            where: {
                steamId: id
            }
        });

        if(player === null) return res.status(404).send("Profile not found!");

        return res.status(200).json(player);
    }  catch(err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
});

router.post('/create', authenticateUser, async(req: Request, res: Response) => {
    try {
        const existingPlayer = await prisma.player.findFirst({
            where: {
                steamId: req.body.steamId
            }
        });
        if(existingPlayer !== null) return res.status(400).send("Steam user already registered!");

        const steamReq = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2?key=${process.env.STEAM_API_KEY}&steamids=${req.body.steamId}`);
        if(steamReq.status !== 200) return res.status(400).send("An unexpected error occurred!");
        const steamData = await steamReq.json();
        if(steamData.response?.players?.length <= 0 || steamData.response?.players[0] === undefined) return res.status(404).send("Player not found!");
        const player = steamData.response.players[0];
        const name = player.personaname;
        const country = player.loccountrycode;
        const avatar = player.avatarfull;
        const steamId = req.body.steamId;
        if(typeof name !== "string") return res.status(400).send("Error! Please provide a valid name!");
        if(typeof steamId !== "string") return res.status(400).send("Error! Please provide a valid steamId!");

        const lowestRank = await prisma.player.count() + 1;
        const profile = await prisma.player.create({
            data: {
                id: genProfileId(),
                name: name,
                rank: lowestRank,
                locRank: lowestRank,
                steamId: steamId,
                country: country,
                pfp: avatar
            }
        });
        return res.status(200).json(profile);
    } catch(err) {
        console.error(err);
        return res.status(500).send("Internal Server Error!");
    }
});

export default router;
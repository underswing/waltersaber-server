import Express, {Request, Response} from "express";

const router = Express.Router();

export async function authenticateUser(req: Request, res: Response, next: any) {
    try {
        const ticket = req.headers['authorization']?.split(' ')[1];
        if (!ticket) return res.status(401).send("No auth ticket provided!");

        const appid = process.env.STEAM_APP_ID as string;
        const key = process.env.STEAM_API_KEY as string;

        const result = await fetch(`https://api.steampowered.com/ISteamUserAuth/AuthenticateUserTicket/v1/?key=${key}&appid=${appid}&ticket=${ticket}`);
        if (result.status !== 200) return res.status(403).send("Forbidden");

        const data = await result.json();
        if (data?.response?.params?.result !== "OK") return res.status(400).send("Invalid ticket!");

        req.body.steamId = data.response.params.steamid;
        next();
    } catch(err) {
        console.log(err);
        return res.status(500).send("Internal Server Error!");
    }
}

router.get("/verify-auth", authenticateUser, (_req: Request, res: Response) => {
    return res.status(200).send("Successfully logged into WalterSaber!");
});

export default router;
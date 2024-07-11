import Express, {Request, Response} from "express";
const router = Express.Router();

router.get("/", async (req: Request, res: Response) => {
    const queryParams = req.query as Record<string, any>;
    queryParams["openid.mode"] = "check_authentication";
    let queryArr = [];
    for(const k in queryParams) {
        queryArr.push(`${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`);
    }

    const authRes = await fetch(`https://steamcommunity.com/openid/login?${queryArr.join("&")}`, {
        method: "GET"
    });
    const result = await authRes.text();
    if(!result.match(/is_valid\s*:\s*true/i)) return res.status(400).send("Error while authenticating!");
    const matches = queryParams["openid.claimed_id"].match(/^https:\/\/steamcommunity\.com\/openid\/id\/([0-9]{17,25})/);
    if(matches.length === 0) return res.status(400).send("Error, ID not found!")
    const steamID64 = matches[1];
    console.log(steamID64);
    const user = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamID64}`);
    const userData = (await user.json()).response.players[0];
    console.log(userData);
    return res.status(200).json(userData);
});

export default router;
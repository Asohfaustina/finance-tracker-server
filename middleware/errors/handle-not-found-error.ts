import { type Response } from "express";
import { type _Request } from "@/global.types";

function handleNotFoundError(_req: _Request, res: Response) {
	return res.status(404).send('page not found');
}

export default handleNotFoundError;

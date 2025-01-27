import { _Request } from "@/global.types";

import { Response } from "express";

export class HealthController {
	public healthCheck = async (_: _Request, res: Response) => {
		res.send("server running! 🎉");
	};
}

import { _Request } from "@/global.types";
import { Response, NextFunction } from "express";

export function errorMiddleware(fn: Function) {
	return (req: _Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

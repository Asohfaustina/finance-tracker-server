import { type _Request } from "@/global.types";
import {
	type Response,
	type NextFunction
} from "express";
import ServerError from "@/lib/server-error";
import ensureError from "@/lib/ensure-error";

export default function convertError(
	error: unknown,
	_req: _Request,
	_res: Response,
	next: NextFunction
) {
	if (error instanceof ServerError) return next(error);
	else {
		let err = ensureError(error);
		const baseError = new ServerError(500, err.message, {
			cause: err,
			context: JSON.stringify(err, Object.getOwnPropertyNames(err))
		});
		return next(baseError);
	}
}

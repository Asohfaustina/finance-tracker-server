import { _Request } from "@/global.types";
import ensureError from "@/lib/ensure-error";
import ServerError from "@/lib/server-error";
import { sessionService } from "@/services/session.service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

/**
 * This verifies that a request has a jwt token present.
 * It also confirms that the jwt token is valid and not expired.
 * It should be placed first before other security access verification.
 * It returns an object containing the key, and user in the req.user object
 */
export default async function verifyToken(req: _Request, _res: Response, next: NextFunction) {
	try {
		const auth_header = req.headers["authorization"];
		const token = auth_header && auth_header.split(" ")[1];
		if (!token) throw new Error("Unauthorized/malformed token");
		const session = await sessionService.confirmSession(token);
		if (!session) throw new Error("Unauthorized");

		req.user = session.jwt;
		req.session = session.session;
		return next();
	} catch (error) {
		const err = new ServerError(httpStatus.UNAUTHORIZED, "unauthorized", {
			context: JSON.stringify(error),
			cause: ensureError(error),
		});

		next(err);
	}
}

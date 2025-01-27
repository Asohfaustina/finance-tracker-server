import { type Response, type NextFunction } from "express";
import { type _Request } from "@/global.types";
import ServerError from "@/lib/server-error";
import ILogger from "@/interfaces/logger.interface";

export default function handleError(logger: ILogger) {
	return (error: ServerError, _req: _Request, res: Response, _next: NextFunction) => {
		const statusCode = error.status;
		const msg = error.message;

		res.locals["errorMessage"] = error.message;

		const response = {
			code: statusCode,
			msg,
		};

		const result = `Msg: "${response.msg}"; Context: ${JSON.stringify(error, null, 3)}`;
		logger.logError(result);
		res.status(statusCode).json(response);
	};
}

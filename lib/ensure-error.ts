import { ZodError } from "zod";

export default function ensureError(error: unknown): Error {
	if (error instanceof Error) return error;
	if (error instanceof ZodError) {
		const newError = new Error(error.errors[0].message);
		return newError;
	} else {
		let stringified = "[unable to stringify error]";
		try {
			stringified = JSON.stringify(error, Object.getOwnPropertyNames(error));
		} catch { }
		const newError = new Error(stringified);
		return newError;
	}
}

import { _Request, zodPaginationQuery } from "@/global.types";
import { UploadService } from "@/services/upload.service";
import { UserService } from "@/services/user.service";
import { Response } from "express";
import { z } from "zod";

export class UserController {
	private userService: UserService;
	private uploadService: UploadService;
	constructor() {
		this.userService = new UserService();
		this.uploadService = new UploadService();
	}

	public findUserById = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});

		const payload = validation.parse(req.params);
		const response = await this.userService.findUserById(payload.id);

		res.json(response);
	};

	public findUserByEmail = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string(),
		});
		const { email } = validation.parse(req.query);
		
		const response = await this.userService.findUserByEmail(email);
		res.json(response);
	};

	public updateUser = async (req: _Request, res: Response) => {
		const validation = z.object({
			name: z.string().optional(),
		});
		const validate = validation.parse(req.body);
		const response = await this.userService.updateUser(req.params.id, validate);

		res.json(response);
	};

	public uploadUserAvatar = async (req: _Request, res: Response) => {
		const validation = z.object({
			fileSize: z.number(),
			fileMimetype: z.string(),
			fileData: z.string(),
		});

		const payload = validation.parse(req.body);

		const response = await this.uploadService.createUpload(req.params.id, payload);

		res.json(response);
	};

	public updateUserAvatar = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
			fileSize: z.number(),
			fileMimetype: z.string(),
			fileData: z.string(),
		});

		const { id, ...payload } = validation.parse(req.body);

		const response = await this.uploadService.updateUpload(id, payload);

		res.json(response);
	};

	public verifyUser = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string(),
		});

		const data = validation.parse(req.query);
		const response = await this.userService.verifyUser(data.email);
		res.json(response);
	};

	public getUsers = async (req: _Request, res: Response) => {
		const validation = z
			.object({
				name: z.string().optional(),
				isActive: z.boolean().optional(),
				isEmailVerified: z.boolean().optional(),
			})
			.merge(zodPaginationQuery);

		const filters = validation.parse(req.query);

		const response = await this.userService.getUsers(filters);
		res.json(response);
	};

	public deactivateUser = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});
		const query = validation.parse(req.params);

		const response = await this.userService.deactivateUser(query.id);
		res.json(response);
	};

	public activateUser = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});
		const query = validation.parse(req.params);

		const response = await this.userService.activateUser(query.id);
		res.json(response);
	};

	public deleteUser = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});
		const query = validation.parse(req.params);

		const response = await this.userService.deleteUser(query.id);
		res.json(response);
	};
}

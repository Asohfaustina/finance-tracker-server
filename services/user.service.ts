import { UserDAL } from "@/dal/user.dal";
import { UserCreationAttributes, UserQueries } from "@/interfaces/user.interface";
import ServerError from "@/lib/server-error";
import httpStatus from "http-status";
import { User } from "@/types/user.types";
import { Pagination } from "@/global.types";
import { NewUpload } from "@/types/upload.types";
import { UploadService } from "./upload.service";
import { actionService } from "./actions.service";

export class UserService {
	private userDal: UserDAL;
	private uploadService: UploadService;

	constructor() {
		this.userDal = new UserDAL();
		this.uploadService = new UploadService();
	}

	public async createUser(data: UserCreationAttributes): Promise<User> {
		await actionService.sendEmailVerificationOtp(data.email);

		const confirmation = await this.userDal.findUserByEmail(data.email);

		if (confirmation) throw new ServerError(httpStatus.BAD_REQUEST, "User already exist");

		const user = await this.userDal.createUser(data);
		if (!user) throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create User");
		await actionService.sendEmailVerificationOtp(user.email);
		return user;
	}

	public async findUserByEmail(email: string): Promise<User> {
		const user = await this.userDal.findUserByEmail(email);
		if (!user) throw new ServerError(httpStatus.NOT_FOUND, "User not found");
		return user;
	}

	public async findUserById(id: string): Promise<User> {
		const user = await this.userDal.findUserById(id);
		if (!user) throw new ServerError(httpStatus.NOT_FOUND, "User not found");
		return user;
	}

	public async getUsers(filters: Partial<UserQueries> = {}): Promise<Pagination<User>> {
		return await this.userDal.getAllUsers(filters);
	}

	public async updateUser(id: string, updates: Partial<User>): Promise<User> {
		const updated = await this.userDal.updateUser(id, updates);
		if (!updated) throw new ServerError(httpStatus.NOT_FOUND, "User not found");
		return updated;
	}

	public async confirmPassword(email: string, password: string): Promise<User> {
		const user = await this.userDal.confirmPassword(email, password);

		if (!user) throw new ServerError(httpStatus.UNAUTHORIZED, "Invalid credentials");

		return user;
	}

	public async updateUserPassword(email: string, password: string): Promise<User> {
		const user = await this.findUserByEmail(email);

		const updated = await this.userDal.updateUserPassword(user._id, password);

		if (!updated) throw new ServerError(httpStatus.NOT_FOUND, "user not found");

		return user;
	}

	public async uploadUserAvatar(userId: string, upload: NewUpload): Promise<User> {
		await this.uploadService.createUpload(userId, upload);

		return this.findUserById(userId);
	}
	public async updateUserAvatar(id: string, updates: NewUpload): Promise<User> {
		const updated = await this.uploadService.updateUpload(id, updates);
		return await this.findUserById(updated.userId);
	}

	public async verifyUser(email: string): Promise<User> {
		const verified = await this.findUserByEmail(email);
		if (verified.isEmailVerified)
			throw new ServerError(httpStatus.UNPROCESSABLE_ENTITY, "user is already verified");
		return this.updateUser(verified._id, { isEmailVerified: true });
	}

	public async activateUser(id: string): Promise<User> {
		return this.updateUser(id, { isActive: true });
	}

	public async deactivateUser(id: string): Promise<User> {
		return this.updateUser(id, { isActive: false });
	}

	public async deleteUser(id: string): Promise<boolean> {
		return await this.userDal.deleteUser(id);
	}
}

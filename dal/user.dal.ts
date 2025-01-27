import { Pagination } from "@/global.types";
import { UserInstance, UserCreationAttributes, UserQueries } from "@/interfaces/user.interface";
import { paginate } from "@/lib/paginate";
import passwordHasher from "@/lib/password-hasher";
import updateObject from "@/lib/update-object";
import { UserModel } from "@/models/user.model";
import { User } from "@/types/user.types";
import { ModelStatic } from "sequelize";
import BaseDAL from ".";
import { UploadInstance } from "@/interfaces/upload.interface";
import { UploadModel } from "@/models/upload.model";

export class UserDAL extends BaseDAL<User, UserInstance> {
	private User: ModelStatic<UserInstance>;
	private Uploads: ModelStatic<UploadInstance>;


	constructor() {
		super();
		this.User = UserModel;
		this.Uploads = UploadModel
	}

	/**
	 * Create a new user.
	 * @param userData - User creation attributes
	 * @returns The created user instance
	 */
	async createUser(userData: UserCreationAttributes): Promise<User | null> {
		const user = await this.User.create(userData);

		await user.reload();

		return this.sanitize(user);
	}

	/**
	 * Find a user by their ID.
	 * @param id - User ID
	 * @returns The user instance or null
	 */
	async findUserById(id: string): Promise<User | null> {
		const user = await this.User.findByPk(id, {
			include: [{ model:this.Uploads , as: "avatar" }],
		});
		return this.sanitize(user);
	}

	/**
	 * Find a user by their email.
	 * @param email - User email
	 * @returns The user instance or null
	 */
	async findUserByEmail(email: string): Promise<User | null> {
		const user = await this.User.findOne({
			where: { email:email.trim() },
		});

		return this.sanitize(user);
	}

	/**
	 * Get all users, with optional filters.
	 * @param filters - Optional filters for querying users
	 * @returns An array of user instances
	 */
	async getAllUsers(filters: Partial<UserQueries> = {}): Promise<Pagination<User>> {
		const { page = 1, limit = 10, ...queryFilters } = filters;

		const paginated = await paginate(this.User, queryFilters, page, limit);

		const docs = paginated.docs.map((item) => item && this.sanitize(item)!);

		return {
			...paginated,
			docs,
		};
	}

	/**
	 * Update a user's details.
	 * @param id - User ID
	 * @param updates - Fields to update
	 * @returns The updated user instance
	 */
	async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
		const user = await this.User.findByPk(id);
		if (!user) return null;
		const updated = updateObject(this.sanitize(user)!, updates);

		await user.update(updates);
		return updated;
	}

	/**
	 * Update a user's password.
	 * @param id - User ID
	 * @param password - new password
	 * @returns The updated user instance
	 */
	async updateUserPassword(id: string, password: string): Promise<User | null> {
		const user = await this.User.findByPk(id);

		if (!user) return null;
		user.password = await passwordHasher.hash(password);
		await user.save();

		return this.sanitize(user);
	}

	/**
	 * Confirms if the password is correct.
	 * @param email User email
	 * @param password password passed
	 * @returns
	 */
	async confirmPassword(email: string, password: string): Promise<User | null> {
		const user = await this.User.scope("withPassword").findOne({ where: { email } });

		if (!user || !(await passwordHasher.compare(user?.password, password))) return null;
		return await this.findUserByEmail(user.email);
	}
	/**
	 * Confirms if the password is correct.
	 * @param email User email
	 * @param password password passed
	 * @returns
	 */
	async verifyUserEmail(email: string): Promise<User | null> {
		const user = await this.User.findOne({ where: { email } });
		if (!user) return null;

		return this.updateUser(user._id, { isEmailVerified: true });
	}
	/**
	 * deactivate a user by marking them inactive.
	 * @param id - User ID
	 * @returns The updated user instance
	 */
	async deactivateUser(id: string): Promise<User | null> {
		return await this.updateUser(id, { isActive: false });
	}

	/**
	 *  activate a user by marking them active.
	 * @param id - User ID
	 * @returns The updated user instance
	 */
	async activateUser(id: string): Promise<User | null> {
		return await this.updateUser(id, { isActive: true });
	}
	/**
	 * Delete a user permanently.
	 * @param id - User ID
	 * @returns True if deleted, otherwise false
	 */
	async deleteUser(id: string): Promise<boolean> {
		const deleted = await UserModel.destroy({
			where: { _id: id },
		});
		return !!deleted;
	}
}

export const userDAL = new UserDAL();

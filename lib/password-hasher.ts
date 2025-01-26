import { variables } from "@/constants";
import bcrypt from "bcrypt";

class PasswordHasher {
	public async hash(password: string) {
		return await bcrypt.hash(password.trim(), variables.SALT_ROUNDS);
	}

	public async compare(savedPassword: string, password: string) {
		return await bcrypt.compare(password.trim(), savedPassword);
	}
}

const passwordHasher = new PasswordHasher();

export default passwordHasher;

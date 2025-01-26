import { sanitizeModel } from "@/lib/sanitize-model";
import { Model } from "sequelize";

export default class BaseDAL<K, T extends Model> {
	protected sanitize(instance: T | null) {
		return sanitizeModel<K>(instance);
	}
}

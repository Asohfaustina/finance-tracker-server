import { Model } from "sequelize";

export function sanitizeModel<T>(instance: Model | null): T | null {
	return instance ? instance.get({ plain: true }) : null;
}

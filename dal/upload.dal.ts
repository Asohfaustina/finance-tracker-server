import { UploadCreationAttributes, UploadInstance } from "@/interfaces/upload.interface";
import { UploadModel } from "@/models/upload.model";
import { ModelStatic } from "sequelize";
import BaseDAL from ".";
import { Upload } from "@/types/upload.types";
import updateObject from "@/lib/update-object";

export class UploadDal extends BaseDAL<Upload, UploadInstance> {
	private Upload: ModelStatic<UploadInstance>;

	constructor() {
		super();
		this.Upload = UploadModel;
	}

	public async createUpload(uploadData: UploadCreationAttributes): Promise<Upload | null> {
		const uploaded = await this.Upload.create({...uploadData, avatar_id: uploadData.userId});
		return this.sanitize(uploaded);
	}

	public async updateUpload(id: string, updates: Partial<Upload>): Promise<Upload | null> {
		const upload = await this.Upload.findByPk(id);
		if (!upload) return null;
		const updated = updateObject(this.sanitize(upload)!, updates);

		await upload.update(updates);

		return updated;
	}

	public async findUploadById(id: string): Promise<Upload | null> {
		const upload = await this.Upload.findByPk(id);
		return this.sanitize(upload);
	}
	public async deleteUpload(_id: string): Promise<boolean> {
		const deleted = await this.Upload.destroy({
			where: { _id },
		});

		return !!deleted;
	}
}

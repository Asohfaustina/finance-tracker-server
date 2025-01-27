import { UploadDal } from "@/dal/upload.dal";
import ServerError from "@/lib/server-error";
import { NewUpload, Upload } from "@/types/upload.types";
import httpStatus from "http-status";
import cloudinaryConfig from "@/config/cloudinary.config";

export class UploadService {
	private uploadDal: UploadDal;

	constructor() {
		this.uploadDal = new UploadDal();
	}

	private verifyFile(fileData: string): string {
		const regex = /^data:image\/[^;]+;base64,/;
		if (!regex.test(fileData)) throw new ServerError(httpStatus.BAD_REQUEST, "file data invalid");
		return fileData;
	}
	public async createUpload(userId: string, upload: NewUpload): Promise<Upload> {
		const fileData = this.verifyFile(upload.fileData);

		const response = await cloudinaryConfig.uploader.upload(fileData, {
			folder: "finance-tracker",
		});

		const uploaded = await this.uploadDal.createUpload({
			name: response.public_id,
			url: response.url,
			mimetype: upload.fileMimetype,
			size: upload.fileSize,
			userId,
		});

		if (!uploaded) throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "failed to upload file");

		return uploaded;
	}

	public async updateUpload(id: string, updates: NewUpload): Promise<Upload> {
		const fileData = this.verifyFile(updates.fileData);

		const upload = await this.findUploadById(id);

		const response = await cloudinaryConfig.uploader.upload(fileData, {
			overwrite: true,
			public_id: upload.name,
		});

		const updated = await this.uploadDal.updateUpload(upload._id, {
			name: response.public_id,
			url: response.url,
			mimetype: updates.fileMimetype,
			size: updates.fileSize,
		});

		if (!updated) throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update file");

		return await this.findUploadById(updated._id);
	}

	public async findUploadById(id: string): Promise<Upload> {
		const upload = await this.uploadDal.findUploadById(id);
		if (!upload) throw new ServerError(httpStatus.NOT_FOUND, "upload not found");

		return upload;
	}
}

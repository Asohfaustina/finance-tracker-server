export type Upload = {
	_id: string;
	name: string;
	url: string;
	mimetype: string;
	size: number;
	userId: string;
	createdAt: string;
	updatedAt: string;
};


export type NewUpload = {
	fileSize: number;
	fileMimetype: string;
	fileData: string;
};

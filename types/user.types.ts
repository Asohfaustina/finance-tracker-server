export type User = {
	_id: string;
	name: string;
	email: string;	
	avatar?: string | undefined;
	isActive: boolean;
	isEmailVerified: boolean;
	createdAt: string;
	updatedAt: string;
};

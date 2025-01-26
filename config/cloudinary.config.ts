import { variables } from "@/constants";
import cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: variables.CLOUDINARY.name,
	api_key: variables.CLOUDINARY.key,
	api_secret: variables.CLOUDINARY.secret,
});

export default cloudinary.v2;

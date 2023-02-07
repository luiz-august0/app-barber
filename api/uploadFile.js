import multer from "multer";
import path from "path";

export const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.resolve("upload_files"));
	},
	filename: (req, file, callback) => {
		const time = new Date().getTime();

		callback(null, `${time}_${file.originalname}`);
	}
})
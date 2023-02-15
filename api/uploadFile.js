var cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: 'dvwxrpftt',
	api_key: '418787596457926',
	api_secret: '7pBTDOts5RjveG7jONsWEtqhf_Q',
	
})

const opts = {
	overwrite: true,
	invalidate: true,
	resource_type: "auto"
}

module.exports = (file) => {
	console.log(file);
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(file, opts, (error, result) => {
			if (result && result.secure_url) {
				return resolve('v' + result.version + '/' +  result.public_id + '.' + result.format);
			}
			//console.log(error.message);
			return reject({ message: error.message });
		})
	})
}

/*export const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.resolve("upload_files"));
	},
	filename: (req, file, callback) => {
		const time = new Date().getTime();

		callback(null, `${time}_${file.originalname}`);
	}
})*/
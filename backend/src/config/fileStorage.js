const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const profilePictureDirName = "images/profilePictures/";
const messagePictureDirName = "images/messagePictures/";

if (!fs.existsSync("images")) {
	fs.mkdirSync("images");
}

if (!fs.existsSync(profilePictureDirName)) {
	fs.mkdirSync(profilePictureDirName);
}

if (!fs.existsSync(messagePictureDirName)) {
	fs.mkdirSync(messagePictureDirName);
}

const profilePictureStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, profilePictureDirName);
	},
	filename: async (req, file, cb) => {
		const fileName = `profile-picture-${req.user.userId}.jpg`;
		const filePath = path.join(profilePictureDirName, fileName);

		try {
			await fs.promises.access(filePath, fs.constants.F_OK);

			// file with the same name already exists, delete it
			await fs.promises.unlink(filePath);

			cb(null, fileName);
		} catch (error) {
			cb(null, fileName);
		}
	},
});

const messagePictureStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, messagePictureDirName);
	},
	filename: async (req, file, cb) => {
		const uuid = uuidv4();
		const fileName = `${uuid}.jpg`;
		const filePath = path.join(messagePictureDirName, fileName);

		try {
			await fs.promises.access(filePath, fs.constants.F_OK);

			// file with the same name already exists, delete it
			await fs.promises.unlink(filePath);

			cb(null, fileName);
		} catch (error) {
			cb(null, fileName);
		}
	},
});

exports.uploadProfilePicture = multer({ storage: profilePictureStorage });
exports.uploadMessagePicture = multer({ storage: messagePictureStorage });

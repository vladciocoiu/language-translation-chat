const multer = require("multer");
const path = require("path");
const fs = require("fs");

const profilePictureDirName = "images/profilePictures/";
if (!fs.existsSync("images")) {
	fs.mkdirSync("images");
}

if (!fs.existsSync(profilePictureDirName)) {
	fs.mkdirSync(profilePictureDirName);
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

exports.uploadProfilePicture = multer({ storage: profilePictureStorage });

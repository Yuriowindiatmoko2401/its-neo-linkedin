import * as userService from '../services/user.service.js';
import cloudinary from "../lib/cloudinary.js";

export const getSuggestedConnections = async (req, res, next) => {
	try {
		const suggestedUsers = await userService.getSuggestedUsers(req.user._id, 3);
		res.json(suggestedUsers);
	} catch (error) {
		next(error);
	}
};

export const getPublicProfile = async (req, res, next) => {
	try {
		const user = await userService.findUserByUsername(req.params.username);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		next(error);
	}
};

export const updateProfile = async (req, res, next) => {
	try {
		// Handle cloudinary image uploads first
		let updatedData = { ...req.body };

		if (req.body.profilePicture && req.body.profilePicture.startsWith('data:')) {
			const result = await cloudinary.uploader.upload(req.body.profilePicture);
			updatedData.profilePicture = result.secure_url;
		}

		if (req.body.bannerImg && req.body.bannerImg.startsWith('data:')) {
			const result = await cloudinary.uploader.upload(req.body.bannerImg);
			updatedData.bannerImg = result.secure_url;
		}

		// Use service to update user data
		const user = await userService.updateUserProfile(req.user._id, updatedData);
		res.json(user);
	} catch (error) {
		next(error);
	}
};

import * as postService from '../services/post.service.js';
import Notification from "../models/notification.model.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";

export const getFeedPosts = async (req, res, next) => {
	try {
		const posts = await postService.getFeedPostsForUser(req.user._id, req.user.connections);
		res.status(200).json(posts);
	} catch (error) {
		next(error);
	}
};

export const createPost = async (req, res, next) => {
	try {
		const { content, image } = req.body;
		const newPost = await postService.createNewPost(req.user._id, content, image);
		res.status(201).json(newPost);
	} catch (error) {
		next(error);
	}
};

export const deletePost = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		await postService.deletePostById(postId, userId);
		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		if (error.message === 'Post not found') {
			return res.status(404).json({ message: "Post not found" });
		}
		if (error.message === 'Not authorized to delete this post') {
			return res.status(403).json({ message: "You are not authorized to delete this post" });
		}
		next(error);
	}
};

export const getPostById = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const post = await postService.getPostById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json(post);
	} catch (error) {
		next(error);
	}
};

export const createComment = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const { content } = req.body;

		const post = await postService.addCommentToPost(postId, req.user._id, content);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// create a notification if the comment owner is not the post owner
		if (post.author._id.toString() !== req.user._id.toString()) {
			const newNotification = new Notification({
				recipient: post.author,
				type: "comment",
				relatedUser: req.user._id,
				relatedPost: postId,
			});

			await newNotification.save();

			try {
				const postUrl = process.env.CLIENT_URL + "/post/" + postId;
				await sendCommentNotificationEmail(
					post.author.email,
					post.author.name,
					req.user.name,
					postUrl,
					content
				);
			} catch (error) {
				console.log("Error in sending comment notification email:", error);
			}
		}

		res.status(200).json(post);
	} catch (error) {
		next(error);
	}
};

export const likePost = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		// Get post to check if it's already liked (for notification)
		const post = await postService.getPostById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		const isAlreadyLiked = post.likes.includes(userId);
		
		// Toggle like using service
		const updatedPost = await postService.toggleLikeOnPost(postId, userId);

		res.status(200).json(updatedPost);

		// Create notification for new likes only (not unlikes)
		if (!isAlreadyLiked && post.author.toString() !== userId.toString()) {
			const newNotification = new Notification({
				recipient: post.author,
				type: "like",
				relatedUser: userId,
				relatedPost: postId,
			});

			await newNotification.save();
		}
	} catch (error) {
		next(error);
	}
};

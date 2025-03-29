import Post from '../models/post.model.js';
import cloudinary from '../lib/cloudinary.js';

export const getFeedPostsForUser = async (userId, connections = []) => {
  return await Post.find({ author: { $in: [...connections, userId] } })
    .populate('author', 'name username profilePicture headline')
    .populate('comments.user', 'name profilePicture')
    .sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
  return await Post.findById(postId)
    .populate('author', 'name username profilePicture headline')
    .populate('comments.user', 'name profilePicture username headline');
};

export const createNewPost = async (userId, content, image) => {
  let newPost;

  if (image) {
    const imgResult = await cloudinary.uploader.upload(image);
    newPost = new Post({
      author: userId,
      content,
      image: imgResult.secure_url,
    });
  } else {
    newPost = new Post({
      author: userId,
      content,
    });
  }

  await newPost.save();
  return newPost;
};

export const deletePostById = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error('Post not found');
  }

  // check if the current user is the author of the post
  if (post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this post');
  }

  // delete the image from cloudinary if it exists
  if (post.image) {
    try {
      const publicId = post.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // continue with post deletion even if image deletion fails
    }
  }

  return await Post.findByIdAndDelete(postId);
};

export const addCommentToPost = async (postId, userId, content) => {
  return await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: { user: userId, content } },
    },
    { new: true }
  )
    .populate('author', 'name username profilePicture headline')
    .populate('comments.user', 'name profilePicture username');
};

export const toggleLikeOnPost = async (postId, userId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }

  const isLiked = post.likes.includes(userId);

  const updateQuery = isLiked 
    ? { $pull: { likes: userId } }
    : { $addToSet: { likes: userId } };

  return await Post.findByIdAndUpdate(postId, updateQuery, { new: true })
    .populate('author', 'name username profilePicture headline')
    .populate('comments.user', 'name profilePicture');
};

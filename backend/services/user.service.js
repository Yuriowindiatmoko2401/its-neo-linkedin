import User from '../models/user.model.js';

export const findUserByUsername = async (username) => {
  return await User.findOne({ username }).select('-password');
};

export const findUserById = async (id) => {
  return await User.findById(id).select('-password');
};

export const getSuggestedUsers = async (userId, limit = 5) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  return await User.find({
    _id: { $ne: userId, $nin: user.connections },
  })
    .select('name username profilePicture headline')
    .limit(limit);
};

export const updateUserProfile = async (userId, updates) => {
  const allowedUpdates = [
    'name', 'headline', 'profilePicture', 'bannerImg', 
    'location', 'about', 'skills'
  ];
  
  // Filter out non-allowed fields
  const filteredUpdates = Object.keys(updates)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});
    
  return await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    { new: true, runValidators: true }
  ).select('-password');
};

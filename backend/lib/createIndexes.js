import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import ConnectionRequest from '../models/connectionRequest.model.js';
import Notification from '../models/notification.model.js';
import { connectDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const createIndexes = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB, creating indexes...');
    
    // User indexes
    console.log('Creating User indexes...');
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    
    // Post indexes
    console.log('Creating Post indexes...');
    await Post.collection.createIndex({ author: 1 });
    await Post.collection.createIndex({ createdAt: -1 });
    
    // Connection request indexes
    console.log('Creating ConnectionRequest indexes...');
    await ConnectionRequest.collection.createIndex({ sender: 1, recipient: 1 }, { unique: true });
    await ConnectionRequest.collection.createIndex({ recipient: 1 });
    await ConnectionRequest.collection.createIndex({ status: 1 });
    
    // Notification indexes
    console.log('Creating Notification indexes...');
    await Notification.collection.createIndex({ recipient: 1 });
    await Notification.collection.createIndex({ read: 1 });
    await Notification.collection.createIndex({ createdAt: -1 });
    
    console.log('All indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();

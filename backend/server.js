import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import helmet from "helmet";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";

import { connectDB } from "./lib/db.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Always enable CORS in development, and conditionally in production
app.use(
	cors({
		origin: process.env.NODE_ENV === "production" 
			? process.env.CLIENT_URL 
			: ["http://localhost:5173", "http://127.0.0.1:5173"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"]
	})
);

app.use(helmet()); // Add security headers
app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());

// Apply stricter rate limiting to auth routes
app.use("/api/v1/auth", authLimiter, authRoutes);
// Apply standard rate limiting to other API routes
app.use("/api/v1/users", apiLimiter, userRoutes);
app.use("/api/v1/posts", apiLimiter, postRoutes);
app.use("/api/v1/notifications", apiLimiter, notificationRoutes);
app.use("/api/v1/connections", apiLimiter, connectionRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Error handling middlewares should be after all routes
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});

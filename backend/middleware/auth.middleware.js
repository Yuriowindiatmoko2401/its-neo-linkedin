import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies["jwt-linkedin"];

		if (!token) {
			return res.status(401).json({ message: "Unauthorized - No Token Provided" });
		}

		// Verify token with proper error handling
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (jwtError) {
			// Handle different JWT errors with appropriate status codes
			if (jwtError.name === 'TokenExpiredError') {
				return res.status(401).json({ message: "Your session has expired. Please login again." });
			} else {
				return res.status(401).json({ message: "Invalid authentication token" });
			}
		}

		// Validate user exists
		if (!decoded || !decoded.userId) {
			return res.status(401).json({ message: "Invalid token format" });
		}

		// Find user with error handling
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({ message: "User account not found or deactivated" });
		}

		// Attach user to request
		req.user = user;
		next();
	} catch (error) {
		console.log("Error in protectRoute middleware:", error.message);
		// Don't expose detailed errors to client
		return res.status(401).json({ message: "Authentication failed" });
	}
};

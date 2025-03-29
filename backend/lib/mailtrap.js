import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

// Create a wrapped version of the mailtrap client that gracefully handles errors
const createMailtrapClient = () => {
	const client = new MailtrapClient({
		token: TOKEN,
	});

	// Create a wrapped send method that gracefully handles errors
	return {
		async send(emailData) {
			try {
				return await client.send(emailData);
			} catch (error) {
				console.error('Mailtrap error:', error.message);
				// Don't throw, just log the error
				return { success: false, error: error.message };
			}
		}
	};
};

export const mailtrapClient = createMailtrapClient();

export const sender = {
	email: process.env.EMAIL_FROM || 'noreply@example.com',
	name: process.env.EMAIL_FROM_NAME || 'LinkedIn Clone',
};

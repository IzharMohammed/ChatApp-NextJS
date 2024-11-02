import { db } from "@/lib/db"; // Import the database instance for interacting with the database
import NextAuth, { NextAuthOptions } from "next-auth"; // Import NextAuth and the type for options
import GoogleProvider from "next-auth/providers/google"; // Import Google authentication provider

// Function to get Google credentials from environment variables
function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID; // Retrieve the Google client ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // Retrieve the Google client secret

    // Check if client ID is provided
    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID'); // Throw an error if client ID is missing
    }

    // Check if client secret is provided
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET'); // Throw an error if client secret is missing
    }

    // Return the credentials
    return { clientId, clientSecret };
}

// Define authentication options for NextAuth
const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt' // Use JSON Web Tokens for session management
    },

    pages: {
        signIn: '/login' // Specify the login page
    },

    providers: [
        // Configure the Google provider with the retrieved credentials
        GoogleProvider({
            clientId: getGoogleCredentials().clientId, // Pass the client ID
            clientSecret: getGoogleCredentials().clientSecret, // Pass the client secret
        })
    ],

    callbacks: {
        // Callback to handle JWT token creation and updates
        async jwt({ token, user }) {
            // Retrieve user data from the database using token ID
            const dbUserResult = await db.get(`user:${token.id}`) as User;

            // If no user found in the database, assign user ID to token if user exists
            if (!dbUserResult) {
                if (user) {
                    token.id = user.id; // Set token ID to user ID
                }
                return token; // Return the token
            }

            // Return a new token object with user details from the database
            return {
                id: dbUserResult.id,
                name: dbUserResult.name,
                email: dbUserResult.email,
                picture: dbUserResult.image // Include user image
            }
        },

        // Callback to handle session creation and updates
        async session({ session, token }) {
            // If the token and session user exist, assign token properties to session user
            if (token && session.user) {
                session.user.id = token.id; // Set session user ID from token
                session.user.name = token.name; // Set session user name from token
                session.user.email = token.email; // Set session user email from token
                session.user.image = token.picture // Set session user image from token
            }
            return session; // Return the updated session
        },

        // Callback to handle redirection after sign-in
        redirect() {
            return '/'; // Redirect to the home page
        }
    },
}

// Export NextAuth with the defined authentication options
export default NextAuth(authOptions);

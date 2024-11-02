import { db } from "@/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function getGoogleCredentials() {

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID');
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET');
    }

    return { clientId, clientSecret };
}

const authOptions: NextAuthOptions = {

    session: {
        strategy: 'jwt'
    },

    pages: {
        signIn: '/login'
    },

    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        })
    ],

    callbacks: {

        async jwt({ token, user }) {

            const dbUserResult = await db.get(`user:${token.id}`) as User;

            if (!dbUserResult) {
                if (user) {
                    token.id = user!.id;
                }
                return token;
            }

            return {
                id: dbUserResult.id,
                name: dbUserResult.name,
                email: dbUserResult.email,
                picture: dbUserResult.image
            }
        },

        async session({ session, token }) {

            if (token && session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture

            }
            return session;
        },

        redirect() {
            return '/'
        }
    },
}

export default NextAuth(authOptions);
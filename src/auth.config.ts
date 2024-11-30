import type { NextAuthConfig, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "./lib/enum";
import { db } from "./db";

interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image: string | null;
}

export default {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            authorize: async (credentials) => {
                // try {
                    if (!credentials?.email) throw new Error("No email provided");

                    const user = await db.user.findFirst({
                        where: {
                            email: credentials.email!,
                        },
                    })

                    return user;
                // } catch (error) {
                //     console.error("Error in login request:", error);
                //     return null;
                // }
            },
        }),
    ],
} as NextAuthConfig;

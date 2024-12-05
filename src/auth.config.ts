import type { NextAuthConfig, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "./lib/enum";
import { db } from "./db";

export default {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            authorize: async (credentials) => {
                if (!credentials?.email) return null; // Invalid email

                const user = await db.user.findFirst({
                    where: {
                        email: credentials.email!,
                    },
                })

                return user;
            },
        }),
    ],
} as NextAuthConfig;

import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { UserRole } from "@prisma/client"
import { db } from "./db"




export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt(data) {
      const { token, user, trigger, session } = data

      if (trigger === 'update') {
        return {
          ...token,
          ...session
        };
      }
      if (user) {
        return {
          ...token,
          ...user
        };
      }
      return token
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub
        session.user.name = token.name
        session.user.role = token.role as UserRole
      }
      // console.log({ session })

      return session
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser && user) {
        
      }
    },
    // async signOut(message) {
    //   // console.log("signOut", message)
    // },
    // async createUser(message) {
    //   // console.log("createUser", message)
    // },
    // async updateUser(message) {
    //   console.log("Updated User", message)
    // },

  }
})
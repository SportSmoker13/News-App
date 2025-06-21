// lib/auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user) return null;
          
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          return isValid ? user : null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error"
  },
  debug: process.env.NODE_ENV !== "production",
  secret: process.env.NEXTAUTH_SECRET,
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export handlers object for App Router
export const handlers = {
  GET: handler,
  POST: handler
};

// Export individual handlers (alternative approach)
export const { GET, POST } = handlers;

// Export for API routes (Pages Router compatibility)
export default handler;

// Export for server components
export async function getServerSession() {
  const { getServerSession } = await import("next-auth/next");
  return getServerSession(authOptions);
}
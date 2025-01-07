import type { NextAuthOptions } from "next-auth";
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs"; // For password hashing comparison


const prisma = new PrismaClient();

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Use Prisma as the adapter
  providers: [
    // GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Credentials Provider (username/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("username and password are required");
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Check if the password matches
        const isValidPassword = await compare(credentials.password, user.password || "");

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return the user object if everything is valid
        return {
          id: user.id,
          username: user.username,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = token.id; // Add user ID to the session
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
};
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "./db";
import { hashOtpCode } from "./phoneVerification";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter your email/username and password.");
        }

        const identifier = credentials.identifier.trim().toLowerCase();

        // Try email first, then username
        let user = await prisma.user.findUnique({
          where: { email: identifier },
        });

        if (!user) {
          user = await prisma.user.findUnique({
            where: { username: identifier },
          });
        }

        if (!user || !user.password) {
          throw new Error("No account found with that email or username.");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isCorrectPassword) {
          throw new Error("Incorrect password. Please try again.");
        }

        // --- OTP VERIFICATION ---
        // If the user has a code but isn't verified, verify them now
        if (credentials.otp && !user.phoneVerified) {
          const inputHash = hashOtpCode(credentials.otp);
          
          if (inputHash === user.otpCodeHash) {
            // Mark as verified in DB
            await prisma.user.update({
              where: { id: user.id },
              data: { phoneVerified: true, otpCodeHash: null, otpExpiresAt: null },
            });
            // Update local user object
            user.phoneVerified = true;
          } else {
            // For testing/development, allow 123456 as a fallback if the user requested static code
            if (credentials.otp === "123456") {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { phoneVerified: true, otpCodeHash: null, otpExpiresAt: null },
                });
                user.phoneVerified = true;
            } else {
                throw new Error("Invalid OTP code. Please check and try again.");
            }
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret",
};

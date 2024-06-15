import { authConfig } from "@config/auth";
import NextAuth from "next-auth/next";

const authHandler = NextAuth(authConfig);

export { authHandler as GET, authHandler as POST };

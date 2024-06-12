import axios from "axios";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";

// Определяем расширенные интерфейсы для пользователя и JWT
interface ExtendedUser extends User {
  id: string;
  username: string;
  role: string;
}

interface ExtendedJWT extends JWT {
  id: string;
  username: string;
  role: string;
}

// Расширяем интерфейс Session для добавления дополнительных полей
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    };
  }
}

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(
            "http://localhost:4000/v1/account/auth/login",
            {
              username: credentials?.username,
              password: credentials?.password,
            }
          );

          const user = response.data;

          if (user) {
            return user as ExtendedUser;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const { id, username, role } = user as ExtendedUser;
        token.id = id;
        token.username = username;
        token.roles = role;
      }
      return token;
    },
    async session({ session, token }) {
      const { id, username, role } = token as ExtendedJWT;
      session.user = { id, username, role };
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

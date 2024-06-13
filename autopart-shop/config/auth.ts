import axios from "axios";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";

// Определяем расширенные интерфейсы для пользователя и JWT
interface ExtendedUser extends User {
  id: string;
  name: string;
  role: string;
}

interface ExtendedJWT extends JWT {
  id: string;
  name: string;
  role: string;
}

// Расширяем интерфейс Session для добавления дополнительных полей
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      role: string;
    };
  }
}

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const res = await fetch("http://localhost:4000/v1/account/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        const user = await res.json();

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Обновляем токен с данными пользователя
      return {
        ...token,
        name: user.name,
        id: user.id,
      };
    },
    async session({ session, token }) {
      // Обновляем сессию с данными пользователя из токена
      const updatedSession = { ...session };
      updatedSession.user = {
        id: token.id as string,
        name: token.name,
      };
      return updatedSession;
    },
  },
};

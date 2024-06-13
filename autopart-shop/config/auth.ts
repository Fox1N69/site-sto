import axios from "axios";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    fio: string;
    role: string;
    username: string;
    token: string;
    expired: string;
  }

  interface Session {
    user: {
      id: string;
      fio: string;
      username: string;
      role: string;
      token: string;
      expired: string;
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
        try {
          const res = await axios.post(
            "http://localhost:4000/v1/account/auth/login",
            {
              username: credentials?.username,
              password: credentials?.password,
            }
          );

          const user = res.data.user;
          const token = res.data.token;
          const expired = res.data.expired;

          if (user) {
            return {
              id: user.id,
              fio: user.fio,
              username: user.username,
              role: user.role,
              token: token,
              expired: expired,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.log("Auth failed", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fio = user.fio;
        token.username = user.username;
        token.role = user.role;
        token.token = user.token;
        token.expired = user.expired;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        fio: token.fio as string,
        username: token.username as string,
        role: token.role as string,
        token: token.token as string,
        expired: token.expired as string,
      };
      return session;
    },
  },
};

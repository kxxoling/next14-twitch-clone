import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import CredentialsProvider from "@auth/core/providers/credentials";
import GitHubProvider from "@auth/core/providers/github";
import { env } from "@/env.mjs";

import { db as prisma } from "@/lib/db";
import { authUserByPassword, addUser } from "@/lib/auth-service";
import { addUserStream } from "@/lib/stream-service";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      image: string | null;
      username: string;
    };
  }
  interface User {
    id: string;
    username: string;
    saltedPassword: string;
  }
}

export const authOptions: any = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          image: user.image,
          username: user.username,
        };
      }
      return token;
    },
    session: ({ session, token, user }: { session: DefaultSession, token: any, user: any }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          image: token.image,
          username: token.username,
        },
      };
    },
  },
  adapter: PrismaAdapter(prisma),
  events: {
    async signIn({ user, isNewUser }: { user: any, isNewUser: any }) {
      if (isNewUser) {
        try {
          addUserStream(user.id, "Stream of " + user.username);
        } catch (error) {
          console.error(error);
          throw new Error("Failed to create user", { cause: error });
        }
      }
      return null;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          placeholder: "test@example.com",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
        isNewUser: {
          label: "New User",
          type: "checkbox",
          required: false,
          hidden: true,
        },
      },
      // @ts-ignore
      async authorize(credentials: {username: string, password: string, isNewUser?: boolean}, req) {
        if (!credentials.username || !credentials.password) {
          return null;
        }
        if (credentials?.isNewUser) {
          try {
            const newUser = await addUser(
              credentials.username,
              credentials.password
            );
            return newUser;
          } catch (error) {
            console.error(error);
            throw new Error("Failed to create user", { cause: error });
          }
        }
        const user = await authUserByPassword(
          credentials.username,
          credentials.password
        );

        if (user) {
          return user;
        }
        return null;
      },
    }),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: null,
          username: profile.login,
        };
      },
    }),
  ],
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

export const getServerAuthSession = (ctx: any) => {
  return auth(ctx);
};

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { name, email, password, method } = credentials as {
          name: string;
          email: string;
          password: string;
          method: string;
        };

        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        const existingName = await prisma.user.findUnique({
          where: {
            name,
          },
        });

        if (method === "signup") {
          if (existingUser) {
            throw new Error("Este email ya esta registrado");
          }
          if(existingName){
            throw new Error("Este nombre ya esta registrado");
          }

          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(password, salt);

          const newUser = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
            },
          });

          return newUser;
        }

        if (!existingUser) {
          throw new Error("Este email no esta registrado");
        }

        const { password: hashedPassword } = existingUser as {
          password: string;
        };

        const validatedPassword = await bcrypt.compare(
          password,
          hashedPassword
        );

        if (!validatedPassword) {
          throw new Error("Contraseña Incorrecta");
        }

        return existingUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: env.JWT_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

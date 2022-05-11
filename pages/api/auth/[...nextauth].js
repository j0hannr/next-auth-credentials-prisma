import NextAuth from "next-auth";
// import Providers from 'next-auth/providers';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
// import { connectToDatabase } from '../../../lib/db';
import prisma from "../../../lib/prisma";

/**
 *
 * Todo
 * ---
 * - Add Prisma
 * - Add Prisma Schema
 * - Get User by email
 *
 */

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    // adapter: PrismaAdapter(prisma),
    providers: [
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          // mangoDB get user by mail
          // const client = await connectToDatabase();
          // const usersCollection = client.db().collection('users');
          // const user = await usersCollection.findOne({
          //   email: credentials.email,
          // });

          // prisma get user by mail
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            // client.close(); // for mongoDB
            throw new Error("No user found!");
          }

          // compare given password with hashed password from database
          const isValid = await verifyPassword(credentials.password, user.password);

          if (!isValid) {
            // client.close(); // for mongoDB
            throw new Error("Could not log you in!");
          }

          console.log("logging in");
          // client.close(); // for mongoDB
          return { email: user.email, name: "JJ" };

          // const userx = { id: 1, name: "J Smith", email: "jsmith@example.com" }
          // return userx
        },
      }),
    ],
    callbacks: {
      //   jwt callback is only called when token is created
      jwt: async ({ token, user }) => {
        // user is obj that we have received from authorize Promise.resolve(user)
        user && (token.user = user);
        // not this token has user property
        return Promise.resolve(token);
      },
      // user arg here is actully token that returned from jwt.
      session: async ({ session, token }) => {
        // session callback is called whenever a session for that particular user is checked
        console.log("user in ...next auth api", token);
        session.user = token.user;
        // since I get error, I return Promise.resolve(session)
        return Promise.resolve(session);
      },
    },
    secret: process.env.SECRET,
    // session: {
    //   jwt: true,
    // },
    session: {
      strategy: "jwt",
    },
    debug: true,
  });
}

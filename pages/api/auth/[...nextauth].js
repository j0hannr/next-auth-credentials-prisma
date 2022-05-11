import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

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

          // prisma get user by mail
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            throw new Error("No user found!");
          }

          // compare given password with hashed password from database
          const isValid = await verifyPassword(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Could not log you in!");
          }
          console.log("user id", user.id)
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return { email: user.email, name: user.name }
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
          }


        },
      }),
    ],
    secret: process.env.SECRET,
    session: {
      jwt: true,
      // Choose how you want to save the user session.
      // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
      // If you use an `adapter` however, we default it to `"database"` instead.
      // You can still force a JWT session by explicitly defining `"jwt"`.
      // When using `"database"`, the session cookie will only contain a `sessionToken` value,
      // which is used to look up the session in the database.
      strategy: "jwt",
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 30 * 24 * 60 * 60, // 30 days * 2

      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      updateAge: 24 * 60 * 60, // 24 hours
    },
    debug: true,
  });
}

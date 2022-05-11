import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import prisma from '../../../lib/prisma';

/**
 * 
 * Todo
 * ---
 * - Add Prisma
 * - Add Prisma Schema
 * - Get User by email
 * 
 */

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
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
          throw new Error('No user found!');
        }

        // compare given password with hashed password from database
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          // client.close(); // for mongoDB
          throw new Error('Could not log you in!');
        }

        // client.close(); // for mongoDB
        return { email: user.email };
        
      },
    }),
  ],
});

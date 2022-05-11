import { getSession } from 'next-auth/client';

import { hashPassword, verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

/**
 * 
 * change password endpoint
 * ---
 * - Add Prisma
 * - Add Prisma Schema
 * - Get User by email
 * 
 */

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  // get variables from request body
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  // mangoDB connection
  const client = await connectToDatabase();
  const usersCollection = client.db().collection('users');
  // get user by email
  const user = await usersCollection.findOne({ email: userEmail });
  // prisma get user by email
  // const user = await prisma.user.findOne({
  //   where: {
  //     email: userEmail,
  //   },
  // });

  // check if user exists
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    client.close();
    return;
  }

  // get user password
  const currentPassword = user.password;
  // check if supplied password matches user's password
  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  // return error if passwords don't match
  if (!passwordsAreEqual) {
    res.status(403).json({ message: 'Invalid password.' });
    client.close();
    return;
  }

  // hash new password
  const hashedPassword = await hashPassword(newPassword);

  // update user password
  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  // prisma update user password
  // const result = await prisma.user.update({
  //   where: {
  //     email: userEmail,
  //   },
  //   data: {
  //     password: hashedPassword,
  //   },
  // });

  client.close(); // for mongoDB
  res.status(200).json({ message: 'Password updated!' });
}

export default handler;

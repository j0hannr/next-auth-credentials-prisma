import { getSession } from "next-auth/react";
import { hashPassword, verifyPassword } from '../../../lib/auth';

 export default async function prismaAuthHandler(req, res) {

  const session = await getSession({ req: req });

  if (req.method !== 'PATCH') {
    return;
  }

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  // get variables from request body
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  // prisma get user by email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  // check if user exists
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  // get user password
  const currentPassword = user.password;
  // check if supplied password matches user's password
  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  // return error if passwords don't match
  if (!passwordsAreEqual) {
    res.status(403).json({ message: 'Invalid password.' });
    return;
  }

  // hash new password
  const hashedPassword = await hashPassword(newPassword);

  // prisma update user password
  const result = await prisma.user.update({
    where: {
      email: userEmail,
    },
    data: {
      password: hashedPassword,
    },
  });

  res.status(200).json({ message: 'Password updated!' });
}
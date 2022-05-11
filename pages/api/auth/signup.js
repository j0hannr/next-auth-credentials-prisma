import { hashPassword } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  console.log("req.body: ", req.body);

  const data = req.body;

  const { email, password } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    });
    return;
  }

  // prisma check if user with given email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  // return error if user already exists
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    return;
  }

  // hash password
  const hashedPassword = await hashPassword(password);

  // prisma insert user into database
  const result = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  // return success message
  res.status(201).json({ message: 'Created user!' });
}

export default handler;

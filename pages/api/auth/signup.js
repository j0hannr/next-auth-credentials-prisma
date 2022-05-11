import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import prisma from '../../../lib/prisma';

/**
 * 
 * signup handler endpoint
 * ---
 * - Add Prisma
 * - Add Prisma Schema
 * - Get User by email
 * 
 */

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

  // mangoDB connection
  // const client = await connectToDatabase();
  // const db = client.db();
  // check if user with given email already exists
  // const existingUser = await db.collection('users').findOne({ email: email });
  // prisma check if user with given email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  // return error if user already exists
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    // client.close(); // for mongoDB
    return;
  }

  // hash password
  const hashedPassword = await hashPassword(password);

  // insert user into database
  // const result = await db.collection('users').insertOne({
  //   email: email,
  //   password: hashedPassword,
  // });

  // prisma insert user into database
  const result = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });


  // return success message
  res.status(201).json({ message: 'Created user!' });
  // client.close(); // for mongoDB
}

export default handler;

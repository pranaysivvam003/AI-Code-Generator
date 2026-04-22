import { NextResponse } from 'next/server';
import { connectDatabase } from '@/app/lib/database';
import bcrypt from 'bcrypt'

async function encryptPass(password) {
  const hashedPass = await bcrypt.hash(password, 10)
  return hashedPass
}

export async function POST(req) {
  try {
    const db = await connectDatabase();
    const body = await req.json();
    const { fullName, email, mobileNumber, password } = body;

    //checking the details sent by user whether details already exists or not
    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { mobileNumber }]
    });

    //Details already available sending the related message
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
      } else {
        return NextResponse.json({ message: 'Mobile number already exists' }, { status: 400 });
      }
    }
    //Details are not available, encrypting the user password and storing them
    const securedPass = await encryptPass(password);
    const userDetails = { fullName, email, mobileNumber, password: securedPass };
    await db.collection('users').insertOne(userDetails);
    return NextResponse.json({ message: `User account created successfully` }, { status: 201 });
  } catch (error) {
    console.error("Error in registration", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

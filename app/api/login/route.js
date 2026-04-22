"use server"

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDatabase } from '@/app/lib/database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

async function validatePassword (password,userPassword){
  const validPassword = await bcrypt.compare(password,userPassword)
  return validPassword
}

export async function POST(req) {
  try {
    const db = await connectDatabase();
    const body = await req.json();
    const { username, password } = body;

    // Finding the user by email or mobile number
    const user = await db.collection('users').findOne({
      $or: [{ email: username }, { mobileNumber: username }]
    });

    if (!user) {
      // User not found, return an error
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // validating password
    const correctPassword = await validatePassword(password, user.password);

    if (!correctPassword) {
      // Invalid password
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Generating the JWT token
    const payload = { mobile: user.mobileNumber, email: user.email };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_CODE);

    // const cookieStore = cookies()
    // cookieStore.set('userToken',jwtToken)
    // cookieStore.set('loginToken',jwtToken,{secure:true})

    // Returning JWT token in the response
    return NextResponse.json({ message: 'Login successful',jwtToken}, { status: 200 });
  } catch (error) {
    console.error("Error processing login request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


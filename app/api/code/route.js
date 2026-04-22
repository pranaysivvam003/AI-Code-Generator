import { NextResponse } from 'next/server'
import { connectDatabase } from '@/app/lib/database'
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const db = await connectDatabase()
    const body = await req.json()
    const {prompt,code} = body
    const userToken = req.headers.get('Authorization')

    if (!userToken) {
      return NextResponse.json({ message: 'User token is missing' }, { status: 200 })
    }

    const userDetails = jwt.verify(userToken, process.env.JWT_SECRET_CODE)
    const { mobile, email } = userDetails

    const codeDetails = { code, prompt, mobile, email,timeStamp:new Date() }

    await db.collection('userCodes').insertOne(codeDetails)
    return NextResponse.json({ message: 'Code saved in database successfully' }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ message: 'Error in saving the code to the database' }, { status: 500 })
  }
}

export async function GET(req) {
  const db = await connectDatabase()
  const userToken = req.headers.get('Authorization')

  try {
    if (!userToken) {
      return NextResponse.json({ message: 'User not logged in' }, { status: 401 })
    }

    const userDetails = jwt.verify(userToken, process.env.JWT_SECRET_CODE)
    const { email, mobile } = userDetails

    const codes = await db.collection('userCodes').find({
      $or: [{ email }, {mobile}]
    }).sort({_id:-1}).toArray()

    // console.log('codes',codes)

    return NextResponse.json({ codes }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "error in fetching the codes" }, { status: 500 })
  }
}
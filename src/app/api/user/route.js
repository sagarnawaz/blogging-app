// src/app/api/user/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';
import { authOptions } from '@/lib/auth';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
      .map(({ password, ...user }) => user); // Remove passwords from response

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    );
  }
}
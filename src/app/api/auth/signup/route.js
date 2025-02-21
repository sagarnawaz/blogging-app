import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { generateId } from '@/lib/utils';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Read existing users
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: generateId(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Add user to file
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}

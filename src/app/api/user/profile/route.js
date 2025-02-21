import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.id === session.user.id);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive information
    const { password, ...userInfo } = user;
    return NextResponse.json(userInfo);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const image = formData.get('image');

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const userIndex = users.findIndex(u => u.id === session.user.id);

    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password if updating password
    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        users[userIndex].password
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      users[userIndex].password = await bcrypt.hash(newPassword, 10);
    }

    // Update name if provided
    if (firstName) users[userIndex].firstName = firstName;
    if (lastName) users[userIndex].lastName = lastName;

    // Handle profile image upload
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const filename = `${session.user.id}-${Date.now()}.${image.type.split('/')[1]}`;
      const filepath = path.join(UPLOADS_DIR, filename);
      
      // Save file
      fs.writeFileSync(filepath, buffer);
      
      // Update user's image path
      users[userIndex].image = `/uploads/${filename}`;
    }

    // Save updated users
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    // Return updated user info without sensitive data
    const { password, ...updatedUser } = users[userIndex];
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating user profile' },
      { status: 500 }
    );
  }
}

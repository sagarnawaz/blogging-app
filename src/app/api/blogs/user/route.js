// src/app/api/blogs/user/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';
import { authOptions } from '@/lib/auth';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf8'));
    const userBlogs = blogs.filter(blog => blog.authorId === session.user.id);
    
    return NextResponse.json(userBlogs);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching user blogs' },
      { status: 500 }
    );
  }
}
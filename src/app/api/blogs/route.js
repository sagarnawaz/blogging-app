// src/app/api/blogs/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';
import { authOptions } from '@/lib/auth';
import { generateId } from '@/lib/utils';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');

export async function GET() {
  try {
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf8'));
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, body } = await request.json();
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf8'));

    const newBlog = {
      id: generateId(),
      title,
      body,
      authorId: session.user.id,
      authorName: `${session.user.firstName} ${session.user.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    blogs.push(newBlog);
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating blog' },
      { status: 500 }
    );
  }
}
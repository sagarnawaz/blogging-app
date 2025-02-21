// src/app/api/blogs/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';
import { authOptions } from '@/lib/auth';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');

export async function PUT(request, { params }) {
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
    
    const blogIndex = blogs.findIndex(blog => 
      blog.id === params.id && blog.authorId === session.user.id
    );

    if (blogIndex === -1) {
      return NextResponse.json(
        { message: 'Blog not found or unauthorized' },
        { status: 404 }
      );
    }

    blogs[blogIndex] = {
      ...blogs[blogIndex],
      title,
      body,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));

    return NextResponse.json(blogs[blogIndex]);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf8'));
    const filteredBlogs = blogs.filter(blog => 
      !(blog.id === params.id && blog.authorId === session.user.id)
    );

    if (filteredBlogs.length === blogs.length) {
      return NextResponse.json(
        { message: 'Blog not found or unauthorized' },
        { status: 404 }
      );
    }

    fs.writeFileSync(BLOGS_FILE, JSON.stringify(filteredBlogs, null, 2));

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting blog' },
      { status: 500 }
    );
  }
}

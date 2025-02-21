'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import BlogForm from '@/components/BlogForm';
import BlogList from '@/components/BlogList';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    const res = await fetch('/api/blogs/user');
    if (res.ok) {
      const data = await res.json();
      setBlogs(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          Welcome, {session?.user?.firstName} {session?.user?.lastName}
        </div>
      </div>
      
      <BlogForm onBlogCreated={fetchUserBlogs} />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        <BlogList blogs={blogs} onBlogUpdated={fetchUserBlogs} onBlogDeleted={fetchUserBlogs} />
      </div>
    </div>
  );
}

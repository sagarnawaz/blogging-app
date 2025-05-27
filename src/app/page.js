// src/app/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import BlogList from '@/components/BlogList';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const blogs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'blogs.json'), 'utf8'))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 20) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {getGreeting()}{session?.user ? `, ${session.user.firstName}` : ''}!
      </h1>
      
      <div className="mt-8">
        {!session && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Welcome to Our Blog Platform
            </h2>
            <p className="text-blue-600 mb-4">
              Join our community to share your thoughts and stories with the world.
            </p>
            <div className="flex gap-4">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {blogs.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold">Recent Posts</h2>
              {blogs.map(blog => (
                <article key={blog.id} className="bg-white text-black rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Link 
                      href={`/author/${blog.authorId}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {blog.authorName}
                    </Link>
                    <span className="mx-2">•</span>
                    <time dateTime={blog.createdAt}>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {blog.body.length > 300
                      ? `${blog.body.substring(0, 300)}...`
                      : blog.body}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/author/${blog.authorId}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      See all posts by {blog.authorName}
                    </Link>
                  </div>
                </article>
              ))}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                No Posts Yet
              </h2>
              <p className="text-gray-500">
                Be the first to share your thoughts with the world!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add metadata
export const metadata = {
  title: 'Home | Blog Platform',
  description: 'Discover amazing stories and share your thoughts with the world.',
};
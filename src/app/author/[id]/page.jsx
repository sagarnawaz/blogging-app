import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import AuthorProfile from '@/components/AuthorProfile';
import BlogList from '@/components/BlogList';
import Link from 'next/link';

async function getAuthorAndBlogs(authorId) {
  const usersFile = path.join(process.cwd(), 'data', 'users.json');
  const blogsFile = path.join(process.cwd(), 'data', 'blogs.json');

  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  const blogs = JSON.parse(fs.readFileSync(blogsFile, 'utf8'));

  const author = users.find(user => user.id === authorId);
  if (!author) return null;

  const authorBlogs = blogs
    .filter(blog => blog.authorId === authorId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Remove sensitive information
  const { password, ...authorInfo } = author;

  return {
    author: authorInfo,
    blogs: authorBlogs
  };
}
// 
export default async function AuthorPage({ params: { id } }) {
    const data = await getAuthorAndBlogs(id);
  
  if (!data) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Home
        </Link>
      </div>

      <AuthorProfile 
        author={data.author}
        blogCount={data.blogs.length}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Posts by {data.author.firstName} {data.author.lastName}
        </h2>
        {data.blogs.length > 0 ? (
          <BlogList blogs={data.blogs} readonly />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Author Profile | Blog Platform',
  description: 'View author profile and all their posts.',
};
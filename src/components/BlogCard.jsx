import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function BlogCard({ blog, onEdit, onDelete }) {
  const { data: session } = useSession();
  const isAuthor = session?.user?.id === blog.authorId;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2 text-black">{blog.title}</h2>
      <div className="text-sm text-gray-500 mb-4">
        By{' '}
        <Link href={`/author/${blog.authorId}`} className="text-primary-600 hover:underline">
          {blog.authorName}
        </Link>
        {' '}on {formatDate(blog.createdAt)}
      </div>
      <p className="text-gray-700 mb-4">{blog.body}</p>
      
      {isAuthor && (
        <div className="flex space-x-4">
          <button
            onClick={onEdit}
            className="text-primary-600 hover:text-primary-800"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

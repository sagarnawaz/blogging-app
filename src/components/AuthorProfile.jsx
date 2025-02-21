import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export default function AuthorProfile({ author, blogCount }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20">
          <Image
            src={author.image || '/default-avatar.png'}
            alt={`${author.firstName} ${author.lastName}`}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {author.firstName} {author.lastName}
          </h2>
          <p className="text-gray-600">{author.email}</p>
          <p className="text-gray-500 text-sm">
            Member since {formatDate(author.createdAt)}
          </p>
          <p className="text-gray-500 text-sm">
            {blogCount} {blogCount === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>
    </div>
  );
}

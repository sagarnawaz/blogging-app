'use client';
import { useState } from 'react';
import BlogCard from './BlogCard';
import EditBlogModal from './EditBlogModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function BlogList({ blogs, onBlogUpdated, onBlogDeleted }) {
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);

  return (
    <div className="space-y-6">
      {blogs.map(blog => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onEdit={() => setEditingBlog(blog)}
          onDelete={() => setDeletingBlog(blog)}
        />
      ))}

      {editingBlog && (
        <EditBlogModal
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onUpdate={onBlogUpdated}
        />
      )}

      {deletingBlog && (
        <DeleteConfirmModal
          blog={deletingBlog}
          onClose={() => setDeletingBlog(null)}
          onDelete={onBlogDeleted}
        />
      )}
    </div>
  );
}
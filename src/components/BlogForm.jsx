'use client';
import { useState } from 'react';

export default function BlogForm({ onBlogCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ title: '', body: '' });
        onBlogCreated();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error creating blog post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Blog Title</label>
        <input
          type="text"
          required
          minLength={5}
          maxLength={50}
          className="w-full p-2 border rounded text-black"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div>
        <label className="block mb-1">Blog Content</label>
        <textarea
          required
          minLength={100}
          maxLength={3000}
          rows={6}
          className="w-full p-2 border rounded text-black"
          value={formData.body}
          onChange={(e) => setFormData({...formData, body: e.target.value})}
        />
      </div>
      <button
        type="submit"
        className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
      >
        Create Post
      </button>
    </form>
  );
}
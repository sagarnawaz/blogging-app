'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    firstName: session?.user?.firstName || '',
    lastName: session?.user?.lastName || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        body: data
      });

      if (res.ok) {
        await update();
        alert('Profile updated successfully!');
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      alert('An error occurred while updating profile');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <div className="w-32 h-32 relative mx-auto mb-2">
            <Image
              src={session?.user?.image || '/default-avatar.png'}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={20}
            className="w-full p-2 border rounded"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            required
            minLength={1}
            maxLength={20}
            className="w-full p-2 border rounded"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={formData.currentPassword}
            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            pattern="(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one uppercase and lowercase letter, and at least 8 characters"
            className="w-full p-2 border rounded"
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
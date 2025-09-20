'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { promoteToAdmin, demoteToRegularUser } from './actions';

export function UserManagement({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingUserIds, setLoadingUserIds] = useState<string[]>([]);

  const handlePromote = async (userId: string) => {
    setLoadingUserIds(prev => [...prev, userId]);
    try {
      await promoteToAdmin(userId);
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, app_metadata: { ...user.app_metadata, role: 'admin' } } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error promoting user:', error);
      alert(`Failed to promote user: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
    } finally {
      setLoadingUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleDemote = async (userId: string) => {
    setLoadingUserIds(prev => [...prev, userId]);
    try {
      await demoteToRegularUser(userId);
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, app_metadata: { ...user.app_metadata, role: 'user' } } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error demoting user:', error);
      alert(`Failed to demote user: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
    } finally {
      setLoadingUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">User Management</h2>
      <table className="mt-4 w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.app_metadata.role || 'user'}</td>
              <td className="border px-4 py-2">
                {user.app_metadata.role !== 'admin' ? (
                  <button
                    onClick={() => handlePromote(user.id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    disabled={loadingUserIds.includes(user.id)}
                  >
                    {loadingUserIds.includes(user.id) ? 'Promoting...' : 'Promote to Admin'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleDemote(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    disabled={loadingUserIds.includes(user.id)}
                  >
                    {loadingUserIds.includes(user.id) ? 'Demoting...' : 'Demote to User'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
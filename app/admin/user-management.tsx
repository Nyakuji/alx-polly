'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { promoteToAdmin, demoteToRegularUser } from './actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';

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
      {/* The Table component from Shadcn/UI provides built-in accessibility features and responsive design. */}
      {/* The `rounded-md border` div ensures the table has a visually distinct container. */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* The 'Email' column is given a flexible width to adapt to different screen sizes. */}
              <TableHead className="w-full sm:w-[200px]">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                {/* TableCell is used for data cells, ensuring proper table structure and accessibility. */}
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.app_metadata.role || 'user'}</TableCell>
                <TableCell>
                  {user.app_metadata.role !== 'admin' ? (
                    <Button
                      onClick={() => handlePromote(user.id)}
                      disabled={loadingUserIds.includes(user.id)}
                      /* aria-label provides an accessible name for the button, important for screen readers. */
                      aria-label={`Promote ${user.email} to Admin`}
                      variant="outline"
                      className="bg-green-500 hover:bg-green-700 text-white"
                    >
                      {loadingUserIds.includes(user.id) ? 'Promoting...' : 'Promote to Admin'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleDemote(user.id)}
                      disabled={loadingUserIds.includes(user.id)}
                      /* aria-label provides an accessible name for the button, important for screen readers. */
                      aria-label={`Demote ${user.email} to User`}
                      variant="outline"
                      className="bg-red-500 hover:bg-red-700 text-white"
                    >
                      {loadingUserIds.includes(user.id) ? 'Demoting...' : 'Demote to User'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
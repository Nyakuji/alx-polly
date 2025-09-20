'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
export async function getUsers() {
  // Verify caller is authorized (example)
  const { data: { user } } = await supabaseAdmin.auth.getUser();
  if (!user || user.app_metadata?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }

  return data.users;
}

export async function promoteToAdmin(userId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );

  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!currentUser) {
    throw new Error('User not authenticated.');
  }

  if (currentUser.app_metadata.role !== 'admin') {
    throw new Error('Only admins can promote users.');
  }

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId provided.');
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role: 'admin' },
  });

  if (error) {
    console.error('Error promoting user:', error);
    throw new Error('Failed to promote user.');
  }

  console.log(`User ${userId} promoted to admin by admin ${currentUser.id}`);

  return data;
}

export async function demoteToRegularUser(userId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );

  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!currentUser) {
    throw new Error('User not authenticated.');
  }

  if (currentUser.app_metadata.role !== 'admin') {
    throw new Error('Only admins can demote users.');
  }

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId provided.');
  }

  if (currentUser.id === userId) {
    throw new Error('Admins cannot demote themselves.');
  }

  const { data: { users }, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();

  if (listUsersError) {
    throw new Error('Failed to list users to check for last admin.');
  }

  const admins = users.filter(user => user.app_metadata.role === 'admin');

  if (admins.length === 1 && admins[0].id === userId) {
    throw new Error('Cannot demote the last admin.');
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role: 'user' },
  });

  if (error) {
    console.error('Error demoting user:', error);
    throw new Error('Failed to demote user.');
  }

  console.log(`User ${userId} demoted to regular user by admin ${currentUser.id}`);

  return data;
}
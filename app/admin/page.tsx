import { getUsers } from './actions';
import { UserManagement } from './user-management';

export default async function AdminPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Responsive heading for the admin dashboard */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6 sm:text-4xl">Admin Dashboard</h1>
      {/* UserManagement component will handle its own responsiveness and accessibility */}
      <UserManagement users={users} />
    </div>
  );
}
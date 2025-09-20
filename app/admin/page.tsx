import { getUsers } from './actions';
import { UserManagement } from './user-management';

export default async function AdminPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <UserManagement users={users} />
    </div>
  );
}
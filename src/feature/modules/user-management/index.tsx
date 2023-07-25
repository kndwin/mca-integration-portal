import { useUsersQuery } from "./api";
import { columns, UserTable } from "./components/table";

export function UserManagementRoute() {
  const { data, status } = useUsersQuery();
  return (
    <div className="px-8 pt-2">
      <h1 className="text-3xl font-medium mb-6">Scheduler</h1>
      <UserTable columns={columns} data={data ?? []} status={status} />
    </div>
  );
}

import { UsersStats } from "@/components/users/UsersStats";
import { getUsers } from "./actions";
import { UsersTableList } from "@/components/users/UsersTableList";

export default async function UsersPage() {
  const users = await getUsers();
  console.log(JSON.stringify(users, null, 2));

  return (
    <div className="w-11/12 mx-auto py-8 max-w-7xl">
      <h1 className="text-2xl font-bold text-zinc-800">Usuários</h1>
      <p className="text-zinc-500">Gerencie os usuários do sistema</p>

      <main className="space-y-6 mt-4">
        <UsersStats users={users} />
        <UsersTableList users={users} />
      </main>
    </div>
  );
}

import { UsersStats } from "@/components/users/UsersStats";
import { getUsers } from "./actions";
import { UsersTableList } from "@/components/users/UsersTableList";
import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import { getBars } from "@/actions/bar.actions";

export default async function UsersPage() {
  const [users, bars] = await Promise.all([getUsers(), getBars()]);

  return (
    <div className="w-11/12 mx-auto py-8 max-w-7xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Usuários</h1>
          <p className="text-zinc-500">Gerencie os usuários do sistema</p>
        </div>
        <CreateUserDialog bars={bars} />
      </div>

      <main className="space-y-6 mt-4">
        <UsersStats users={users} />
        <UsersTableList users={users} bars={bars} />
      </main>
    </div>
  );
}

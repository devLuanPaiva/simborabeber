"use client";
import { Button } from "@/components/ui/button";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { UsersStats } from "@/components/users/UsersStats";
import { UsersTableList } from "@/components/users/UsersTableList";
import { useUser } from "@/data/contexts";
import { useFetchData } from "@/data/hooks";
import { IUser } from "@/data/models";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

export default function UsersPage() {

    const { getUsers, createUser, updateUser } = useUser()

    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<Partial<IUser>>({});
    const [editingUser, setEditingUser] = useState<IUser | null>(null);

    const getUsersData = useCallback(async () => {
        const response = await getUsers();
        if (response.error) {
            throw new Error(response.error.detail || 'Erro ao buscar usuários');
        }
        return response.data || [];
    }, [getUsers]);

    const { data: users, refetch } = useFetchData(getUsersData);

    const handleOpenDialog = (user?: IUser) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
            })
        } else {
            setEditingUser(null);
            setFormData({});
        }
        setShowDialog(true);
    }

    const handleSaveUser = async () => {
        if (editingUser) {
            await updateUser(editingUser.id, { ...editingUser, ...formData });
        } else {
            await createUser(formData);
        }
        setShowDialog(false);

        refetch();
    }

    const handleToggleStatus = async (id: string) => {
        await updateUser(id, { isActive: !(users?.find(user => user.id === id)?.isActive) });
        refetch();
    }
    return <div className="mx-auto w-11/12 max-w-7xl  space-y-8 ">
        <header className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl mb-2">Usuários</h1>
                <p className="text-muted-foreground">Gerencie os usuários da aplicação.</p>
            </div>
            <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2"><Plus className="h-5 w-5" /> Novo Usuário</Button>
        </header>
        <UsersStats users={users || []} />

        <UsersTableList users={users || []} handleOpenDialog={handleOpenDialog} handleToggleStatus={handleToggleStatus} />

        <UserFormDialog formData={formData} formType="create" handleSave={handleSaveUser} setFormData={setFormData} setShowDialog={setShowDialog} showDialog={showDialog} />
    </div>;
}
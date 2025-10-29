"use client";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/ui/notification";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { UsersStats } from "@/components/users/UsersStats";
import { UsersTableList } from "@/components/users/UsersTableList";
import { useUser } from "@/data/contexts";
import { useFetchData } from "@/data/hooks";
import { IUser } from "@/data/models";
import { Plus } from "lucide-react";
import { Suspense, useCallback, useState } from "react";

export default function UsersPage() {

    const { getUsers, createUser, updateUser } = useUser()

    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<Partial<IUser>>({});
    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const getUsersData = useCallback(async () => {
        const response = await getUsers();
        if (response.error) {
            throw new Error(response.error.detail || 'Erro ao buscar usuários');
        }
        return response.data || [];
    }, [getUsers]);

    const { data: users, refetch, loading, error } = useFetchData(getUsersData);

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
        resetMessages();
        if (editingUser) {
            handleUpdateUser();
        } else {
            handleCreateUser();
        }
        setTimeout(() => {
            setShowDialog(false);
            refetch();

        }, 5000);
    }

    const handleCreateUser = async () => {
        const response = await createUser(formData);
        if (response.error) {
            setErrorMessage(response.error.detail || 'Erro ao criar usuário');
            return
        }
        setSuccessMessage('Usuário criado com sucesso!');
    }

    const handleUpdateUser = async () => {
        const response = await updateUser(editingUser!.id, { ...editingUser, ...formData });
        if (response.error) {
            setErrorMessage(response.error.detail || 'Erro ao atualizar usuário');
            return;
        }
        setSuccessMessage('Usuário atualizado com sucesso!');
    }

    const handleToggleStatus = async (id: string) => {
        resetMessages();
        const response = await updateUser(id, { isActive: !(users?.find(user => user.id === id)?.isActive) });
        if (response.error) {
            setErrorMessage(response.error.detail || 'Erro ao atualizar status do usuário');
            return;
        }
        setSuccessMessage('Status do usuário atualizado com sucesso!');

        setTimeout(() => {
            refetch();
        }, 5000);
    }

    const resetMessages = () => {
        setSuccessMessage(null);
        setErrorMessage(null);
    }

    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <Suspense fallback={
            <Loading />
        }>

            <div className="mx-auto w-11/12 max-w-7xl  space-y-8 ">
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
            </div>
            {successMessage && <Notification message={successMessage} type="success" />}
            {errorMessage && <Notification message={errorMessage} type="error" />}
            {error && <Notification message={error} type="error" />}
        </Suspense>

    );
}
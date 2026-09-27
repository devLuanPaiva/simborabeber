"use client";

import { IBar, IUser, UserRole, UserRolesLabels } from "@/data/models";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Trash2, Users } from "lucide-react";
import { formatDate } from "@/data/functions";
import { deleteUser, toggleUserStatus } from "@/app/painel/usuarios/actions";
import { appToast } from "@/utils/toast-ui";
import { EditUserDialog } from "./EditUserDialog";

interface UsersTableListProps {
  users: IUser[];
  bars: IBar[];
}

export function UsersTableList({ users, bars }: Readonly<UsersTableListProps>) {
  const handleToggleStatus = async (id: string) => {
    const res = await toggleUserStatus(id);
    if (res.success) {
      appToast.success(res.message || "Status atualizado");
      return;
    }
    appToast.error(res.error || "Erro ao alterar status");
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUser(id);
    if (res.success) {
      appToast.success(res.message || "Usuário removido");
      return;
    }
    appToast.error(res.error || "Erro ao remover usuário");
  };

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center text-center gap-3">
          <div className="bg-muted p-4 rounded-full">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.role === UserRole.MANAGER
                        ? "bg-secondary/10 text-secondary border-secondary/20"
                        : ""
                    }
                  >
                    {UserRolesLabels[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => handleToggleStatus(user.id)}
                    />
                    <span className="text-sm">
                      {user.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <EditUserDialog user={user} bars={bars} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IBar, IUser, UserRole, UserRolesLabels } from "@/data/models";
import { updateUser } from "@/app/painel/usuarios/actions";
import { appToast } from "@/utils/toast-ui";

interface EditUserDialogProps {
  user: IUser;
  bars: IBar[];
}

export function EditUserDialog({ user, bars }: Readonly<EditUserDialogProps>) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [barId, setBarId] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    const res = await updateUser(user.id, formData);
    if (res.success) {
      appToast.success(res.message || "Usuário atualizado com sucesso");
      return;
    }
    appToast.error(res.error || "Erro ao atualizar usuário");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>Atualize os dados do usuário</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`name-${user.id}`}>Nome Completo</Label>
            <Input id={`name-${user.id}`} name="name" defaultValue={user.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`email-${user.id}`}>E-mail</Label>
            <Input id={`email-${user.id}`} name="email" type="email" defaultValue={user.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`password-${user.id}`}>Nova senha</Label>
            <PasswordInput
              id={`password-${user.id}`}
              name="password"
              minLength={6}
              placeholder="Deixe em branco para manter a atual"
            />
          </div>

          <div className="space-y-2">
            <Label>Função</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((r) => (
                  <SelectItem key={r} value={r}>
                    {UserRolesLabels[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="role" value={role} />
          </div>

          {role === UserRole.MANAGER && (
            <div className="space-y-2">
              <Label>Bar associado</Label>
              <Select value={barId || "none"} onValueChange={(value) => setBarId(value === "none" ? "" : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Manter atual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Manter atual</SelectItem>
                  {bars.map((bar) => (
                    <SelectItem key={bar.id} value={bar.id}>
                      {bar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="barId" value={barId} />
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="cursor-pointer">
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" className="cursor-pointer">
                Salvar
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

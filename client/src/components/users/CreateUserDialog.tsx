"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { IBar, UserRole, UserRolesLabels } from "@/data/models";
import { createUser } from "@/app/painel/usuarios/actions";
import { appToast } from "@/utils/toast-ui";

interface CreateUserDialogProps {
  bars: IBar[];
}

export function CreateUserDialog({ bars }: Readonly<CreateUserDialogProps>) {
  const [role, setRole] = useState<UserRole | "">("");
  const [barId, setBarId] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    const res = await createUser(formData);
    if (res.success) {
      appToast.success(res.message || "Usuário criado com sucesso");
      setRole("");
      setBarId("");
      return;
    }
    appToast.error(res.error || "Erro ao criar usuário");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>Preencha os dados do usuário</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input id="name" name="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              E-mail <span className="text-red-500">*</span>
            </Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Senha <span className="text-red-500">*</span>
            </Label>
            <PasswordInput id="password" name="password" minLength={6} required />
          </div>

          <div className="space-y-2">
            <Label>
              Função <span className="text-red-500">*</span>
            </Label>
            <Select
              value={role || undefined}
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((r) => (
                  <SelectItem key={r} value={r}>
                    {UserRolesLabels[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="role" value={role} required />
          </div>

          {role === UserRole.MANAGER && (
            <div className="space-y-2">
              <Label>Bar associado</Label>
              <Select value={barId || "none"} onValueChange={(value) => setBarId(value === "none" ? "" : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
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

import { IUser, UserRole, UserRolesLabels } from "@/data/models";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface UserFormDialogProps {
    showDialog: boolean;
    setShowDialog: (show: boolean) => void;
    formData: Partial<IUser>
    formType: "create" | "edit";
    setFormData: (data: Partial<IUser>) => void;
    handleSave: () => void;
}
export function UserFormDialog({ showDialog, setShowDialog, formData, formType, setFormData, handleSave }: Readonly<UserFormDialogProps>) {
    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {formType === "edit" ? "Editar Usuário" : "Novo Usuário"}
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os dados do usuário
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail <span className="text-red-500">*</span></Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Função <span className="text-red-500">*</span></Label>
                        <Select value={formData.role ?? undefined} onValueChange={(value: string) => setFormData({ ...formData, role: value as UserRole })}>
                            <SelectTrigger>
                                <SelectValue className="w-full" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(UserRole).map((r) => {
                                    const role = r as UserRole;
                                    return (
                                        <SelectItem key={role} value={role}>
                                            {UserRolesLabels[role]}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>



                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" type="button" className="cursor-pointer" onClick={() => setShowDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} className="cursor-pointer" type="submit">
                            Salvar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
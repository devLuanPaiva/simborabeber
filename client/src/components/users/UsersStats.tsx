import { UserCheck, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { IUser, UserRole } from "@/data/models";

interface UsersStatsProps {
    users: IUser[]
}
export function UsersStats({ users }: Readonly<UsersStatsProps>) {

    const activeUsers = users.filter(user => user.isActive).length;
    const waiters = users.filter(user => user.role === UserRole.WAITER).length;
    const managers = users.filter(user => user.role === UserRole.MANAGER).length;
    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl">{users.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Ativos</p>
                            <p className="text-2xl text-green-600">{activeUsers}</p>
                        </div>
                        <UserCheck className="h-8 w-8 text-green-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Garçons</p>
                            <p className="text-2xl">{waiters}</p>
                        </div>
                        <Users className="h-8 w-8 text-primary" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Gerentes</p>
                            <p className="text-2xl text-secondary">{managers}</p>
                        </div>
                        <Users className="h-8 w-8 text-secondary" />
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
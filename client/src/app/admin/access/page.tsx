"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/data/contexts";
import { decodeTokenToUser } from "@/data/functions";
import { UserRole } from "@/data/models";
import { Eye, EyeOff, Flame, Lock, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function AccessPage() {
    const { login } = useAuth()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoadingOperation, setIsLoadingOperation] = useState<boolean>(false);

    const navigate = useRouter();
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoadingOperation(true);
        setErrorMessage(null);

        try {
            const response = await login(email, password);

            if (response.error) {
                setErrorMessage(response.error.detail);
                return;
            }
            const loggedInUser = decodeTokenToUser(response?.data[0]?.access_token);

            checkRoleAccessAndRedirect(loggedInUser?.role!);
        } catch (error) {
            setErrorMessage("Ocorreu um erro ao tentar efetuar o login. Por favor, tente novamente.");

            console.error("Login error:", error);
        } finally {
            setIsLoadingOperation(false);
        }
    }

    const checkRoleAccessAndRedirect = (role: UserRole) => {
        const roleRoutes: Record<UserRole, string> = {
            [UserRole.ADMIN]: "/admin",
            [UserRole.MANAGER]: "/admin/dashboard",
            [UserRole.WAITER]: "/admin/area-garcom",
        };

        const route = roleRoutes[role];

        if (route) {
            navigate.push(route, { scroll: false });
        } else {
            setErrorMessage("Seu papel de usuário não tem acesso a esta área.");
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Flame className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl">Fogo & Brasa</CardTitle>
                    <CardDescription>Área Administrativa</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-slate-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 bg-slate-50"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full gap-2 cursor-pointer" size="lg">
                            {isLoadingOperation ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 "></div>
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    Entrar
                                </>
                            )}
                        </Button>
                    </form>
                    {errorMessage && (
                        <div className="mt-4 bg-red-300/20 p-3 rounded border border-red-400">
                            <p className=" text-sm text-red-600 text-center">{errorMessage}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../actions";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";

const INITIAL_STATE = {
  error: null,
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_STATE,
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <main className="h-screen flex flex-col md:flex-row bg-[#F2F2F2]">
      <div className="flex flex-col justify-start md:justify-center items-center bg-linear-to-br from-[#F2A20C] to-[#F28B0C] text-white p-12 max-md:pb-0 max-md:h-2/3 md:w-1/2">
        <div className="max-w-sm text-center space-y-3">
          <div className="flex justify-center">
            <div className="bg-white/20 p-6 rounded-2xl backdrop-blur">
              <UtensilsCrossed size={48} />
            </div>
          </div>

          <h1 className="text-4xl font-bold">O seu cardápio</h1>

          <p className="hidden md:flex text-lg text-white/90">
            Gerencie o cardápio do seu bar de forma simples, rápida e moderna.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center max-md:pt-0 p-8 max-md:-mt-48 md:w-1/2">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-[#BFAE99]/20">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-zinc-800">
              Acessar sistema
            </h2>

            <p className="text-zinc-500 mt-1">Entre com suas credenciais</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-600"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="w-full rounded-lg border border-[#BFAE99]/40 px-4 py-2.5 outline-none focus:border-[#F28B0C] focus:ring-2 focus:ring-[#F2BE5C]/40 transition"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-600"
              >
                Senha
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-[#BFAE99]/40 px-4 py-2.5 pr-10 outline-none focus:border-[#F28B0C] focus:ring-2 focus:ring-[#F2BE5C]/40 transition"
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {state.error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#F2A20C] hover:bg-[#F28B0C] disabled:bg-[#F2A20C]/70 text-white font-semibold py-2.5 rounded-lg transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

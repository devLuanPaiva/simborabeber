import { IJwtPayload } from "@/data/types"
import { redirect } from "next/navigation"

export function redirectByRole(user: IJwtPayload) {

    if (user.role === "admin") {
        redirect("/painel/usuarios")
    }

    if (user.role === "manager") {
        if (!user.slug) {
            redirect("/painel/cadastrar-bar")
        }

        redirect(`/painel/bar/${user.slug}`)
    }

    if (user.role === "waiter") {
        redirect(`/painel/bar/${user.slug}`)
    }

}
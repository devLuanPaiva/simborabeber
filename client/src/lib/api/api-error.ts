import { NextResponse } from "next/server"

type ApiErrorOptions = {
    statusCode?: number
    message: string
    code?: string
    field?: string
    detail?: string
}

export function apiError({
    statusCode = 500,
    message,
    code = "INTERNAL_SERVER_ERROR",
    field = "",
    detail = "Ocorreu um erro inesperado.",
}: ApiErrorOptions) {
    return NextResponse.json(
        {
            status: "error",
            message,
            data: null,
            errors: {
                code,
                field,
                detail,
            },
        },
        { status: statusCode }
    )
}
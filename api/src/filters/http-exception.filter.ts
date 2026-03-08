import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface HttpExceptionResponseBody {
    message?: string | string[];
    error?: string;
    detail?: string;
    code?: string;
    field?: string;
}

interface ErrorResponse {
    code: string;
    field: string;
    detail: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const defaultMessageByStatus: Record<number, string> = {
            [HttpStatus.BAD_REQUEST]: 'Requisicao invalida',
            [HttpStatus.UNAUTHORIZED]: 'Nao autorizado',
            [HttpStatus.FORBIDDEN]: 'Acesso negado',
            [HttpStatus.NOT_FOUND]: 'Recurso nao encontrado',
            [HttpStatus.CONFLICT]: 'Conflito de dados',
            [HttpStatus.UNPROCESSABLE_ENTITY]: 'Erro de validacao',
            [HttpStatus.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor',
        };

        const defaultCodeByStatus: Record<number, string> = {
            [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
            [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
            [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
            [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
            [HttpStatus.CONFLICT]: 'CONFLICT',
            [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
            [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
        };

        let message =
            defaultMessageByStatus[status] || 'Erro interno do servidor';

        const errors: ErrorResponse = {
            code: defaultCodeByStatus[status] || 'INTERNAL_SERVER_ERROR',
            field: '',
            detail: '',
        };

        if (exception instanceof HttpException) {
            const res = exception.getResponse();

            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res !== null) {
                const body = res as HttpExceptionResponseBody;

                const rawMessage = body.message;

                if (Array.isArray(rawMessage)) {
                    message = rawMessage.join('; ');
                    errors.detail = rawMessage.join('; ');
                } else if (typeof rawMessage === 'string' && rawMessage.trim() !== '') {
                    message = rawMessage;
                } else {
                    message = exception.message || message;
                }

                if (body.detail) {
                    errors.detail = body.detail;
                } else if (body.error) {
                    errors.detail = body.error;
                }

                if (body.code) {
                    errors.code = body.code;
                }

                if (body.field) {
                    errors.field = body.field;
                }
            }
        } else if (exception instanceof Error) {
            errors.detail = exception.message;
        }

        response.status(status).json({
            status: 'error',
            message: message || 'Erro de validacao',
            data: null,
            errors,
        });
    }
}
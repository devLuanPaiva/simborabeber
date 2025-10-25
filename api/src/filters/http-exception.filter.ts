import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    const errors = {
      code: '',
      field: '',
      detail: '',
    };

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = res['message'] ?? exception.message ?? message;
        if (res['error']) {
          errors.detail = res['error'];
        }
        if (res['code']) {
          errors.code = res['code'];
        }
        if (res['field']) {
          errors.field = res['field'];
        }
      }
    }

    response.status(status).json({
      status: 'error',
      message: message || 'Erro de validação',
      data: null,
      errors,
    });
  }
}

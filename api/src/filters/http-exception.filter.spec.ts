import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  const createMockResponse = () => {
    const res: Partial<Response> & {
      status: jest.Mock;
      json: jest.Mock;
    } = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    return res as unknown as Response;
  };

  const createMockArgumentsHost = (res: Response): ArgumentsHost => {
    const getResponse = jest.fn().mockReturnValue(res);
    const http = { getResponse };
    const switchToHttp = jest.fn().mockReturnValue(http);
    return { switchToHttp } as unknown as ArgumentsHost;
  };

  let filter: HttpExceptionFilter;

  beforeEach(() => {
    jest.clearAllMocks();
    filter = new HttpExceptionFilter();
  });

  it('Custom HttpException with simple message', () => {
    const res = createMockResponse();
    const host = createMockArgumentsHost(res);
    const exception = new HttpException('Forbidden', 403);

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Forbidden',
      data: null,
      errors: { code: '', field: '', detail: '' },
    });
  });

 
});

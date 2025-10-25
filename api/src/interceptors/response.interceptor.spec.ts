import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { Request } from 'express';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  const buildMockRequest = (
    query: Record<string, any> = {},
    opts?: { protocol?: string; host?: string; path?: string }
  ): Request => {
    const protocol = opts?.protocol ?? 'http';
    const host = opts?.host ?? 'localhost:3000';
    const path = opts?.path ?? '/items';
    return {
      protocol,
      get: (header: string) => (header.toLowerCase() === 'host' ? host : undefined),
      path,
      query,
    } as any as Request;
  };

  const buildExecutionContext = (req: Request): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as any as ExecutionContext);

  const buildCallHandler = (data: any): CallHandler => ({
    handle: () => of(data),
  });

  const interceptor = new ResponseInterceptor();

  test('Array input, default pagination (no query)', async () => {
    const req = buildMockRequest({});
    const ctx = buildExecutionContext(req);

    const items = Array.from({ length: 7 }, (_, i) => i + 1);
    const next = buildCallHandler(items);

    const result = await lastValueFrom(interceptor.intercept(ctx, next));

    expect(result.status).toBe('success');
    expect(result.count).toBe(7);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(1); 
    expect(result.results).toEqual(items); 
    expect(result.next).toBeNull();
    expect(result.previous).toBeNull();
  });

  
});

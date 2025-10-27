import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { Request } from 'express';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  const buildMockRequest = (
    query: Record<string, any> = {},
    opts?: { protocol?: string; host?: string; path?: string },
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
    }) as any as ExecutionContext;

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

  test('Paginated object with explicit offset & limit (string query values)', async () => {
    const query = { offset: '10', limit: '5', sort: 'asc', filter: 'alpha' };
    const req = buildMockRequest(query);
    const ctx = buildExecutionContext(req);

    const rawResults = Array.from({ length: 30 }, (_, i) => ({ id: i }));
    const data = { count: 23, results: rawResults };
    const next = buildCallHandler(data);

    const result = await lastValueFrom(interceptor.intercept(ctx, next));

    expect(result.status).toBe('success');
    expect(result.count).toBe(23);
    expect(result.currentPage).toBe(3);
    expect(result.totalPages).toBe(Math.ceil(23 / 5));

    expect(result.results).toEqual(rawResults.slice(10, 15));

    expect(result.next).toBeTruthy();
    expect(result.previous).toBeTruthy();

    const nextUrl = String(result.next);
    const prevUrl = String(result.previous);

    expect(nextUrl).toContain('http://localhost:3000/items?');
    expect(prevUrl).toContain('http://localhost:3000/items?');

    expect(nextUrl).toContain('offset=15');
    expect(nextUrl).toContain('limit=5');
    expect(nextUrl).toContain('sort=asc');
    expect(nextUrl).toContain('filter=alpha');

    expect(prevUrl).toContain('offset=5');
    expect(prevUrl).toContain('limit=5');
    expect(prevUrl).toContain('sort=asc');
    expect(prevUrl).toContain('filter=alpha');
  });

  test('Preserve other query params when building next/previous URLs', async () => {
    const query = { search: 'term', offset: '2', limit: '2' };
    const req = buildMockRequest(query);
    const ctx = buildExecutionContext(req);

    const items = Array.from({ length: 6 }, (_, i) => i + 1);
    const next = buildCallHandler(items);

    const result = await lastValueFrom(interceptor.intercept(ctx, next));

    expect(result.currentPage).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.results).toEqual(items.slice(2, 4));

    const nextUrl = String(result.next);
    const prevUrl = String(result.previous);

    expect(nextUrl).toContain('search=term');
    expect(nextUrl).toContain('offset=4');
    expect(nextUrl).toContain('limit=2');

    expect(prevUrl).toContain('search=term');
    expect(prevUrl).toContain('offset=0');
    expect(prevUrl).toContain('limit=2');
  });

  test('Non-array single object (no pagination)', async () => {
    const req = buildMockRequest({});
    const ctx = buildExecutionContext(req);

    const payload = { id: 1, name: 'x' };
    const next = buildCallHandler(payload);

    const result = await lastValueFrom(interceptor.intercept(ctx, next));

    expect(result).toEqual({
      status: 'success',
      result: payload,
    });
    expect(result).not.toHaveProperty('results');
    expect(result).not.toHaveProperty('count');
    expect(result).not.toHaveProperty('next');
    expect(result).not.toHaveProperty('previous');
  });

  test('Edge case: offset greater than count -> empty results and correct page numbers', async () => {
    const query = { offset: '1000', limit: '10' };
    const req = buildMockRequest(query);
    const ctx = buildExecutionContext(req);

    const data = { count: 5, results: [1, 2, 3, 4, 5] };
    const next = buildCallHandler(data);

    const result = await lastValueFrom(interceptor.intercept(ctx, next));

    expect(result.count).toBe(5);
    expect(result.results).toEqual([]);
    expect(result.currentPage).toBe(Math.floor(1000 / 10) + 1);
    expect(result.totalPages).toBe(Math.ceil(5 / 10));
    expect(result.next).toBeNull();
    expect(result.previous).toBeTruthy();
    expect(String(result.previous)).toContain('offset=990');
    expect(String(result.previous)).toContain('limit=10');
  });
});

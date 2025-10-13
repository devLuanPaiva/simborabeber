import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Observable, map } from "rxjs"
import { Request } from "express"

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest<Request>()

    const baseUrl = `${request.protocol}://${request.get("host")}${request.path}`
    const originalQuery = request.query

    const offset = parseInt(originalQuery.offset as string) || 0
    const limit = parseInt(originalQuery.limit as string) || 100

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data) || (data && Array.isArray(data.results))) {
          const rawResults = Array.isArray(data) ? data : data?.results ?? []
          const count = Array.isArray(data) ? rawResults.length : data?.count ?? rawResults.length

          const currentPage = Math.floor(offset / limit) + 1
          const totalPages = Math.ceil(count / limit)

          const results = rawResults.slice(offset, offset + limit)

          const hasNext = results.length === limit && currentPage < totalPages
          const hasPrevious = currentPage > 1

          const buildUrl = (newOffset: number) => {
            const query = new URLSearchParams({
              ...originalQuery,
              offset: String(newOffset),
              limit: String(limit),
            }).toString()
            return `${baseUrl}?${query}`
          }

          return {
            status: "success",
            count,
            currentPage,
            totalPages,
            next: hasNext ? buildUrl(offset + limit) : null,
            previous: hasPrevious ? buildUrl(Math.max(0, offset - limit)) : null,
            results,
          }
        }


        return {
          status: "success",
          result: data,
        }
      }),
    )
  }
}
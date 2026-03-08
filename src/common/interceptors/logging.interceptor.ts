import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const { method, originalUrl, ip } = req;
    const userAgent = req.headers['user-agent'] ?? '';
    const start = Date.now();

    this.logger.log(`→ ${method} ${originalUrl} [${ip}] ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.logger.log(
            `← ${method} ${originalUrl} ${res.statusCode} +${ms}ms`,
          );
        },
        error: (err) => {
          const ms = Date.now() - start;
          const status = err?.status ?? 500;
          this.logger.error(
            `← ${method} ${originalUrl} ${status} +${ms}ms — ${err?.message}`,
          );
        },
      }),
    );
  }
}

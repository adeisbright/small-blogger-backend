import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ErrorService } from './errors.service';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(
    private readonly errorService: ErrorService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      catchError((error) => {
        if (error.name === "'AxiosError") {
          this.logger.error({
            message: error.message,
            url: error.config.url,
            payload: error.config.data,
          });
        } else {
          this.logger.error({
            message: error.message,
            stack: error.stack,
          });
        }
        return throwError(() => this.handleErrorResponse(response, error));
      }),
    );
  }

  private handleErrorResponse(res: Response, error: any) {
    return this.errorService.errorResponse(res, error);
  }
}

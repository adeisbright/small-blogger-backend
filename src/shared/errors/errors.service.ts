import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Error } from './interface';
import { ObjectLiteral } from '../interfaces';
import { Response } from 'express';
@Injectable()
export class ErrorService {
  constructor() {}

  serviceError(error: ObjectLiteral): any {
    switch (error.name) {
      case 'AxiosError':
        const message = error?.response?.data || error?.message;
        switch (error.code) {
          case 'ERR_BAD_RESPONSE':
            throw new HttpException(message, HttpStatus.BAD_REQUEST);
          case 'ECONNREFUSED':
            throw new HttpException(
              'Service connection refused',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          case 'ERR_NETWORK':
          case 'ETIMEDOUT':
            throw new HttpException(
              'Service not reachable',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          case 'ECONNABORTED':
            throw new HttpException(
              'Biller service not responding',
              HttpStatus.REQUEST_TIMEOUT,
            );
          default:
            throw new HttpException(
              'Oops! Something went wrong',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      default:
        switch (error.name) {
          case 'BadRequestException':
            throw new BadRequestException(error.message);
          case 'NotFoundException':
            throw new NotFoundException(error.message);
          case 'UnauthorizedException':
            throw new UnauthorizedException(error.message);
          case 'TokenExpiredError':
            throw new UnauthorizedException(error.message);
          default:
            const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException(
              {
                ...(statusCode < 400 && {
                  status: 'success',
                  data: {},
                }),
                ...(statusCode >= 400 && {
                  errors: {},
                }),
                message: error.message,
              },
              statusCode,
            );
        }
    }
  }

  controllerError(error: any): Error {
    return {
      errors: {},
      status: 'error',
      message: error.message,
      responseMessage: error.message,
    };
  }

  errorResponse(res: Response, error: any) {
    return res.status((error.status || error.response?.status) ?? 500).json({
      errors: {},
      status: 'error',
      message: error.message,
    });
  }
}

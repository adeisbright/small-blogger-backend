import { Request, Response } from 'express';
import { ErrorService } from '../errors/errors.service';
import { IResponseInterface } from '../interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SuccessResponse {
  constructor(private readonly errorService: ErrorService) {}

  async ok(
    res: Response,
    req: Request | any,
    responseData: IResponseInterface,
  ) {
    try {
      const { data, cache, extraData } = responseData;
      const response: Record<string, any> = {};
      if (cache) {
        response.response = data;
        response.response.cached = cache;
      } else {
        response.response = {
          status: 'success',
          data: data,
        };
      }

      if (extraData) {
        response.response = {
          ...response.response,
          extraData,
        };
      }
      return res.status(200).json({
        ...response.response,
        csrfToken: req['csrfToken'],
      });
    } catch (e) {
      return this.errorService.controllerError(e);
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { doubleCsrfProtection } from '../../../middleware/csrf.middleware';
import { Request, Response } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    return new Promise((resolve, reject) => {
      doubleCsrfProtection(req, res, (err: any) => {
        if (err) {
          res.status(403).json({ message: 'CSRF Token ❗' });
          return reject(new HttpException('CSRF Token ❗', 403));
        }
        resolve(true);
      });
    });
  }
}

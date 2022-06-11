import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;

      // content-length 전달되는 개체 크기
      const contentLength = response.get('content-length');

      this.logger.log(
        `HTTP[${method}] URL[${originalUrl}] status[${statusCode}] CONTENT_LEN[${contentLength}]
AGENT[${userAgent}] IP[${ip}]`,
      );
    });

    next();
  }
}

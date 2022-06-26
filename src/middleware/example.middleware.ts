import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class ExampleMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    response.on('finish', () => {
      const { statusCode } = response;

      // content-length 전달되는 개체 크기
      const contentLength = response.get('content-length');
      //   response.write(JSON.stringify({ test: 'test' }));
      //   response.writeHead(204, { 'content-type': 'application/json' });
      //   this.logger.log(response);
      //   response.setHeader;
      console.log('EXAMPLE MIDDLEWARE');
      //   console.log(response.setHeader('ttt', 'okk'));
    });

    next();
  }
}

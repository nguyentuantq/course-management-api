import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestLogger implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} - ${ms}ms`);
    });
    next();
  }
}

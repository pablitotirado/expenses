import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  getHealth(): {
    status: string;
    test: string;
    timestamp: string;
    uptime: number;
  } {
    return {
      status: 'ok',
      test: 'test',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

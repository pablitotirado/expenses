import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health check', () => {
    const result = controller.getHealth();
    expect(result.status).toBe('ok');
    expect(result.test).toBe('test');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('uptime');
  });
});

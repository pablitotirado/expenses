import { Injectable } from '@nestjs/common';
import { StatisticsRepository } from './repositories/statistics.repository';

@Injectable()
export class StatisticsService {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async getSummary() {
    return await this.statisticsRepository.getSummary();
  }
}

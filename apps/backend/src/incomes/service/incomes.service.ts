import { Injectable, NotFoundException } from '@nestjs/common';
import { IncomeRepository } from '../repositories/income.repository';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { IncomeApi } from 'expenses-shared';
import { convertIncomeToApi } from '../../common/utils/date-converter';

@Injectable()
export class IncomesService {
  constructor(private readonly _incomeRepository: IncomeRepository) {}

  async create(createIncomeDto: CreateIncomeDto): Promise<IncomeApi> {
    const income = await this._incomeRepository.create(createIncomeDto);
    return convertIncomeToApi(income);
  }

  async findAll(): Promise<IncomeApi[]> {
    const incomes = await this._incomeRepository.findAll();
    return incomes.map(convertIncomeToApi);
  }

  async findOne(id: string): Promise<IncomeApi> {
    const income = await this._incomeRepository.findOne(id);
    if (!income) {
      throw new NotFoundException(`Income with ID ${id} not found`);
    }
    return convertIncomeToApi(income);
  }

  async update(
    id: string,
    updateIncomeDto: UpdateIncomeDto,
  ): Promise<IncomeApi> {
    // First check if income exists
    await this.findOne(id);

    const income = await this._incomeRepository.update(id, updateIncomeDto);
    return convertIncomeToApi(income);
  }

  async remove(id: string): Promise<IncomeApi> {
    // First check if income exists
    await this.findOne(id);

    const income = await this._incomeRepository.delete(id);
    return convertIncomeToApi(income);
  }
}

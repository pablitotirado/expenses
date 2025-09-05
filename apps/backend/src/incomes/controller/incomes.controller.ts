import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IncomesService } from '../service/incomes.service';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { IncomeType } from '../../common/types/prisma.types';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly _incomesService: IncomesService) {}

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto): Promise<IncomeType> {
    return this._incomesService.create(createIncomeDto);
  }

  @Get()
  findAll(): Promise<IncomeType[]> {
    return this._incomesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IncomeType> {
    return this._incomesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ): Promise<IncomeType> {
    return this._incomesService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IncomeType> {
    return this._incomesService.remove(id);
  }
}

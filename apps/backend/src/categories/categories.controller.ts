import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryWithCount } from '../common/types/prisma.types';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly _categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryWithCount> {
    return this._categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(): Promise<CategoryWithCount[]> {
    return this._categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryWithCount | null> {
    return this._categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ): Promise<CategoryWithCount> {
    return this._categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<CategoryWithCount> {
    return this._categoriesService.remove(id);
  }
}

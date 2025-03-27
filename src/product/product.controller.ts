import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('商品')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: '创建商品',
    description: '创建商品',
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({
    summary: '获取商品列表',
    description: '获取商品列表',
  })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({
    summary: '获取商品',
    description: '获取商品',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @ApiOperation({
    summary: '更新商品',
    description: '更新商品',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiOperation({
    summary: '删除商品',
    description: '删除商品',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}

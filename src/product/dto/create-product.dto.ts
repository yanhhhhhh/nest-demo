import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: '商品名称',
  })
  readonly name: string;
  @ApiProperty({
    description: '商品描述',
  })
  readonly desc: string;
  @ApiProperty({
    description: '商品价格',
  })
  readonly price: number;
}

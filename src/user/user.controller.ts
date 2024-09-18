import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  /**
   *  http://localhost:3000/v1/user
   * @returns
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  /**
   * http://localhost:3000/v2/user/2222
   * @param id
   * @returns
   */
  @Version('2')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  /**
   *  http://localhost:3000/v1/user/1
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  postFile(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);

    return `file upload success ${JSON.stringify(createUserDto)} `;
  }
}

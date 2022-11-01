import {
  Controller,
  Body,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  HttpStatus,
  HttpException,
  Query,
  Param,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { query } from 'express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import { File, User } from './interfaces';

const UserList: User[] = [];
const FileList: File[] = [];

@Controller('user')
export class UserController {
  @Post('singlefile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @Body() Body) {
    console.log('Body', Body.name);
    const user = UserList.find((ele) => ele.firstName == Body.name);
    if (user) {
      const response = {
        originalname: file.originalname,
        fileName: file.filename,
        createdBy: Body.name,
        description: Body.description,
      };
      FileList.push(response);
      return response;
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Post()
  createUser(@Body() Body): any[] {
    const user = UserList.find((ele) => ele.firstName == Body.firstName);
    if (!user) {
      UserList.push(Body);
      return Body;
    } else {
      throw new HttpException('User already exist', HttpStatus.FORBIDDEN);
    }
  }

  @Get('/:name')
  getFile(@Query() query, @Param() param): any {
    console.log(param);
    let page = 0;
    const limit = query.limit ? query.limit : 2;
    if (query.page) page = limit * query.page;

    const files = FileList.filter((ele) => ele.createdBy == param.name);
    const totalcount = files.length;
    return { allFiles: files.splice(page, limit), totalcount: totalcount };
  }
}

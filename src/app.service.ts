import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  newUser(body: any): object {
    return {
      firstName: body.firstName,
      lastName: body.lastName,
      files: [],
    };
  }
}

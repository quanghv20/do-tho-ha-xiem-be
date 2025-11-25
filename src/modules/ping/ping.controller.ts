import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class PingController {
  @Get()
  ping() {
    return {
      statusCode: 200,
      message: 'pong',
    };
  }
}

import { Query, Body, Controller, Get, Post, Request } from '@nestjs/common';
import { GetSubAccountDto } from 'src/dto/get-sub-account.dto';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { UserService } from '../user/user.service';

@Controller('/api')
export class RestApiController {
  constructor(private readonly _userService: UserService) {}

  @Get('random_mnemonic')
  async generateRandomSeedPhrase() {
    return await this._userService.generateRandomSeedPhrase();
  }

  @Get('test_auth')
  async testAuth() {
    return 1;
  }

  @Post('register_user')
  async registerUser(@Body() body: RegisterUserDto) {
    return await this._userService.registerUser(body);
  }

  @Get('sub_account')
  async getSubAccount(@Query() query: GetSubAccountDto, @Request() request) {
    return await this._userService.getSubAccount(
      query,
      request.user,
      request.seedPhrase,
    );
  }
}

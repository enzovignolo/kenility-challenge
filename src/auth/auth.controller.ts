import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignInDTO, SignInResponse } from './dto/signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @ApiOkResponse({ type: SignInResponse })
  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(@Body() data: SignInDTO): Promise<SignInResponse> {
    const token = await this.authService.signIn(data);
    return { token };
  }
}

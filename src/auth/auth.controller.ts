import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hello world private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  // @SetMetadata('roles', ['admin', 'superuser'])
  @Get('private2')
  @UseGuards(AuthGuard(), UserRoleGuard)
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hello world private',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hello world private',
      user,
    };
  }
}

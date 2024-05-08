import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string | string[], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    if (!data) {
      return user;
    }

    if (typeof data === 'string') {
      return user[data];
    }

    return data.map((item) => user[item]);
  },
);

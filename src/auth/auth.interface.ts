import { UserEntity } from 'src/user/user.entity';
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { EUserRole } from 'src/user/user.interface';

export type AuthenticatedUser = Pick<UserEntity, 'id' | 'email' | 'role'>;
export type JwtPayload = {
  sub: string;
  email: string;
  role: EUserRole;
};

export type UserContext = {
  req: {
    user: AuthenticatedUser;
  };
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<UserContext>().req.user;
  },
);

export const AllowedUserRoles = (...roles: EUserRole[]) =>
  SetMetadata('roles', roles);

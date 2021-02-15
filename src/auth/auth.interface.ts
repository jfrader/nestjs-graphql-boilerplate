import { UserEntity } from 'src/user/user.entity';
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { EUserRole } from 'src/user/user.interface';

import { Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

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

export const ResGql = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Response => {
    return GqlExecutionContext.create(context).getContext().req.res;
  },
);

export const GqlUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserEntity => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req && ctx.req.user;
  },
);

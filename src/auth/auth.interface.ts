import { UserEntity } from 'src/user/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type AuthenticatedUser = Pick<UserEntity, 'id' | 'email'>;
export type JwtPayload = {
  sub: string;
  email: string;
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

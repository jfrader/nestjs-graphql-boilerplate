import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { getI18nResolverOptionsToken } from 'nestjs-i18n';

function I18nResolverOptions() {
  return (target: () => void, key: string | symbol, index?: number): any => {
    return Inject(getI18nResolverOptionsToken(target))(target, key, index);
  };
}

export interface I18nResolver {
  resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> | string | string[] | undefined;
}

@Injectable()
export class HeaderResolver implements I18nResolver {
  constructor(
    @I18nResolverOptions()
    private keys: string[] = [],
  ) {}

  resolve(context: ExecutionContext) {
    let req: any;

    switch (context.getType() as string) {
      case 'http':
        req = context.switchToHttp().getRequest();
        break;
      case 'graphql':
        [, , { req }] = context.getArgs();
        break;
    }

    let lang: string;

    if (req) {
      for (const key of this.keys) {
        if (key === 'accept-language') {
          console.warn(
            'HeaderResolver does not support RFC4647 Accept-Language header. Please use AcceptLanguageResolver instead.',
          );
        }
        if (req.headers[key] !== undefined) {
          lang = req.headers[key];
          break;
        }
      }
    }

    return lang;
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TryCatch = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const tmp = ctx.getHandler();

    console.log(tmp);
    return tmp;
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import errorCodesExternal from 'src/config/errorCodesExternal';
import { ApplicationErrorException } from '../../../exceptions';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (!request.user) {
        throw new ApplicationErrorException(errorCodesExternal['E-01211']);
    }
    if (data) {
        return request.user[data];
    }
    return request.user;
});

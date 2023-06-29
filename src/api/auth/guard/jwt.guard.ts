import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { ApplicationErrorException } from '../../../exceptions';
import errorCodesExternal from 'src/config/errorCodesExternal';

export class JwtGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const authorization = request.headers['authorization'];
        const isBearerToken = authorization?.search('Bearer ') === 0;
        if (!authorization || !isBearerToken) {
            throw new ApplicationErrorException(errorCodesExternal['E-01300']);
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // if (err || !user) {
        //     if (info instanceof TokenExpiredError) {
        //         throw new ApplicationErrorException(errorCodesExternal['E-01301'], undefined, HttpStatus.UNAUTHORIZED);
        //     }
        //     // if (info instanceof JsonWebTokenError) {
        //     //     throw new ApplicationErrorException(errorCodesExternal['E-01302'], undefined, HttpStatus.UNAUTHORIZED);
        //     // }
        //     // throw err || info;
        // }
        return user;
    }
}

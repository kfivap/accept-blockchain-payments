import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { decryptSeedPhrase } from './auth.lib';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<User>,
  ) {}

  async use(req: Request & any, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      );
      const [login, password] = credentials.split(':');

      //   const userExists = await this._userModel.findOne({ login });
      //   if (userExists) {
      //     const phraseOk = decryptSeedPhrase(
      //       userExists.encryptedPhrase,
      //       password,
      //     );
      //     if (phraseOk) {
      //       // Set the authenticated user on the request object
      //       req.user = userExists;
      //     }
      //   }
      const userExists = await this._userModel.findOne({ login });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }
      const phraseOk = decryptSeedPhrase(userExists.encryptedPhrase, password);
      if (!phraseOk) {
        throw new UnauthorizedException('Bad password');
      }
      req.user = userExists;
    }

    next();
  }
}

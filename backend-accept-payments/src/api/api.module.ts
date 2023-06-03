import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RestApiController } from './rest-api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [RestApiController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .exclude('/api/register', '/api/random_mnemonic');
  }
}

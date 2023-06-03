import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ApiModule,
    MongooseModule.forRoot('mongodb://localhost:27017/accept_payments'),
  ],
})
export class AppModule {}

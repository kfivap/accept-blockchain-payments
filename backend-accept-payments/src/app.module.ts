import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlockchainModule } from './blockchain/blockchain.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiModule,
    BlockchainModule,
    MongooseModule.forRoot('mongodb://localhost:27017/accept_payments'),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuyTransactionsController } from './buy-transactions.controller';
import { BuyTransactionsService } from './buy-transactions.service';
import { BuyTransaction, BuyTransactionSchema } from './schemas/buy-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BuyTransaction.name, schema: BuyTransactionSchema },
    ]),
  ],
  controllers: [BuyTransactionsController],
  providers: [BuyTransactionsService],
  exports: [BuyTransactionsService],
})
export class BuyTransactionsModule {}

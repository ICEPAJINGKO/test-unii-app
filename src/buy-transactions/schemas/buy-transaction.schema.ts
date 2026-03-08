import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BuyTransactionDocument = HydratedDocument<BuyTransaction>;

@Schema()
export class GradeItem {
    @Prop({ required: true })
    grade: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    quantity: string;

    @Prop({ required: true })
    total: number;
}

@Schema()
export class RequestItem {
    @Prop({ required: true })
    categoryID: string;

    @Prop({ type: [Object], required: true })
    requestList: GradeItem[];

    @Prop({ required: true })
    subCategoryID: string;
}

@Schema()
export class PartyInfo {
    @Prop({ required: true })
    roleName: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    id: string;
}

@Schema()
export class TransactionParties {
    @Prop({ type: Object, required: true })
    customer: PartyInfo;

    @Prop({ type: Object, required: true })
    transport: PartyInfo;

    @Prop({ type: Object, required: true })
    collector: PartyInfo;
}

@Schema({ collection: 'buy_transactions', timestamps: true })
export class BuyTransaction {
    @Prop({ required: true, unique: true })
    orderId: string;

    @Prop({ type: [Object], required: true })
    requestList: RequestItem[];

    @Prop({ type: Object, required: true })
    transactionParties: TransactionParties;

    @Prop({ required: true })
    orderFinishedDate: string;

    @Prop({ required: true })
    orderFinishedTime: string;
}

export const BuyTransactionSchema = SchemaFactory.createForClass(BuyTransaction);

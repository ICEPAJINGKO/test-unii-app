import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuyTransaction, BuyTransactionDocument } from './schemas/buy-transaction.schema';
import { QueryBuyTransactionDto } from './dto/query-buy-transaction.dto';

@Injectable()
export class BuyTransactionsService {
    constructor(
        @InjectModel(BuyTransaction.name)
        private readonly buyTransactionModel: Model<BuyTransactionDocument>,
    ) { }

    async query(dto: QueryBuyTransactionDto): Promise<any[]> {
        const {
            startDate,
            endDate,
            categoryId,
            subCategoryId,
            orderId,
            grade,
        } = dto;

        const minPrice = dto.minPrice !== undefined ? Number(dto.minPrice) : undefined;
        const maxPrice = dto.maxPrice !== undefined ? Number(dto.maxPrice) : undefined;

        const pipeline: any[] = [];

        const matchConditions: Record<string, any> = {};

        if (startDate || endDate) {
            matchConditions.orderFinishedDate = {};
            if (startDate) matchConditions.orderFinishedDate.$gte = startDate;
            if (endDate) matchConditions.orderFinishedDate.$lte = endDate;
        }

        if (orderId) {
            matchConditions.orderId = { $regex: orderId, $options: 'i' };
        }

        const hasInnerFilter =
            grade !== undefined || minPrice !== undefined || maxPrice !== undefined;

        const outerElemMatch: Record<string, any> = {};
        if (categoryId) outerElemMatch.categoryID = categoryId;
        if (subCategoryId) outerElemMatch.subCategoryID = subCategoryId;

        if (hasInnerFilter) {
            const innerElemMatch: Record<string, any> = {};
            if (grade) innerElemMatch.grade = grade;
            if (minPrice !== undefined || maxPrice !== undefined) {
                innerElemMatch.price = {};
                if (minPrice !== undefined) innerElemMatch.price.$gte = minPrice;
                if (maxPrice !== undefined) innerElemMatch.price.$lte = maxPrice;
            }
            outerElemMatch.requestList = { $elemMatch: innerElemMatch };
        }

        if (Object.keys(outerElemMatch).length > 0) {
            matchConditions.requestList = { $elemMatch: outerElemMatch };
        }

        pipeline.push({ $match: matchConditions });

        if (hasInnerFilter || categoryId || subCategoryId) {
            const innerCondArr: any[] = [];
            if (grade) innerCondArr.push({ $eq: ['$$item.grade', grade] });
            if (minPrice !== undefined) innerCondArr.push({ $gte: ['$$item.price', minPrice] });
            if (maxPrice !== undefined) innerCondArr.push({ $lte: ['$$item.price', maxPrice] });

            const innerCond: any =
                innerCondArr.length === 0
                    ? null
                    : innerCondArr.length === 1
                        ? innerCondArr[0]
                        : { $and: innerCondArr };

            const outerCondArr: any[] = [];
            if (categoryId) outerCondArr.push({ $eq: ['$$req.categoryID', categoryId] });
            if (subCategoryId) outerCondArr.push({ $eq: ['$$req.subCategoryID', subCategoryId] });

            if (innerCond) {
                outerCondArr.push({
                    $gt: [
                        {
                            $size: {
                                $filter: {
                                    input: '$$req.requestList',
                                    as: 'item',
                                    cond: innerCond,
                                },
                            },
                        },
                        0,
                    ],
                });
            }

            const outerCond: any =
                outerCondArr.length === 1
                    ? outerCondArr[0]
                    : { $and: outerCondArr };

            const filteredInnerList = innerCond
                ? { $filter: { input: '$$req.requestList', as: 'item', cond: innerCond } }
                : '$$req.requestList';

            pipeline.push({
                $addFields: {
                    requestList: {
                        $map: {
                            input: {
                                $filter: {
                                    input: '$requestList',
                                    as: 'req',
                                    cond: outerCond,
                                },
                            },
                            as: 'req',
                            in: {
                                categoryID: '$$req.categoryID',
                                subCategoryID: '$$req.subCategoryID',
                                requestList: filteredInnerList,
                            },
                        },
                    },
                },
            });
        }

        if (grade) {
            const flatAllItems = {
                $reduce: {
                    input: '$requestList',
                    initialValue: [] as any[],
                    in: { $concatArrays: ['$$value', '$$this.requestList'] },
                },
            };

            pipeline.push({
                $addFields: {
                    gradeSummary: {
                        grade,
                        totalQuantity: {
                            $reduce: {
                                input: flatAllItems,
                                initialValue: 0,
                                in: { $add: ['$$value', { $toInt: '$$this.quantity' }] },
                            },
                        },
                        totalAmount: {
                            $reduce: {
                                input: flatAllItems,
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.total'] },
                            },
                        },
                        itemCount: { $size: flatAllItems },
                    },
                },
            });
        }

        return this.buyTransactionModel.aggregate(pipeline).exec();
    }
}

import { Controller, Get, Query } from '@nestjs/common';
import { BuyTransactionsService } from './buy-transactions.service';
import { QueryBuyTransactionDto } from './dto/query-buy-transaction.dto';

@Controller('buy-transactions')
export class BuyTransactionsController {
    constructor(
        private readonly buyTransactionsService: BuyTransactionsService
    ) { }

    /**
     * GET /buy-transactions/search
     *
     * Query parameters (all optional, combinable):
     *  - startDate        YYYY-MM-DD   (inclusive)
     *  - endDate          YYYY-MM-DD   (inclusive)
     *  - categoryId       exact match on requestList[].categoryID
     *  - subCategoryId    exact match on requestList[].subCategoryID
     *                     (scope is automatically limited to the given categoryId)
     *  - orderId          contains / partial search (case-insensitive)
     *  - minPrice         inclusive lower bound on grade-item price
     *  - maxPrice         inclusive upper bound on grade-item price
     *  - grade            A | B | C | D  – filters items and adds gradeSummary
     */
    @Get('search')
    search(@Query() queryDto: QueryBuyTransactionDto) {
        return this.buyTransactionsService.query(queryDto);
    }
}

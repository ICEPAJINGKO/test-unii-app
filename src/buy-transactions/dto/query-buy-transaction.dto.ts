export class QueryBuyTransactionDto {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  subCategoryId?: string;
  orderId?: string;
  minPrice?: number;
  maxPrice?: number;
  grade?: string;
}

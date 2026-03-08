export class GradeItemDto {
  grade: string;
  price: number;
  quantity: string;
  total: number;
}

export class RequestItemDto {
  categoryID: string;
  requestList: GradeItemDto[];
  subCategoryID: string;
}

export class PartyInfoDto {
  roleName: string;
  name: string;
  id: string;
}

export class TransactionPartiesDto {
  customer: PartyInfoDto;
  transport: PartyInfoDto;
  collector: PartyInfoDto;
}

export class CreateBuyTransactionDto {
  orderId: string;
  requestList: RequestItemDto[];
  transactionParties: TransactionPartiesDto;
  orderFinishedDate: string;
  orderFinishedTime: string;
}

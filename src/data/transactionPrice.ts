// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface TransactionPriceResponse {
    dealTransactionPrice: TransactionPrice;
    leaseTransactionPrice: TransactionPrice;
    rentTransactionPrice: TransactionPrice;
}

export interface TransactionPrice {
    hscpNo: string;
    ptpNo: string;
    tradeType: string;
    realTransactionPriceList: RealTransactionPriceList[];
    basisYearMonth: string;
    hasMore: boolean;
}

export interface RealTransactionPriceList {
    tradeYear: string;
    tradeMonth: string;
    tradeDate: string;
    deposit: number;
    dealPrice: number;
    rentPrice: number;
    floor: number;
    rnum: number;
    lastIndex: number;
}

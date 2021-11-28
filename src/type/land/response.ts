export interface Room {
    markerId: string;
    markerType: string;
    latitude: number;
    longitude: number;
    complexName: string;
    realEstateTypeCode: string;
    realEstateTypeName: string;
    completionYearMonth: string;
    totalDongCount: number;
    totalHouseholdCount: number;
    floorAreaRatio: number;
    minDealUnitPrice: number;
    maxDealUnitPrice: number;
    minLeaseUnitPrice: number;
    maxLeaseUnitPrice: number;
    minLeaseRate: number;
    maxLeaseRate: number;
    minArea: string;
    maxArea: string;
    minDealPrice: number;
    maxDealPrice: number;
    minLeasePrice: number;
    maxLeasePrice: number;
    minRentPrice: number;
    maxRentPrice: number;
    minShortTermRentPrice: number;
    maxShortTermRentPrice: number;
    isLeaseShown: boolean;
    priceCount: number;
    representativeArea: number;
    medianLeaseUnitPrice: number;
    medianLeasePrice: number;
    representativePhoto: string;
    photoCount: number;
    dealCount: number;
    leaseCount: number;
    rentCount: number;
    shortTermRentCount: number;
    totalArticleCount: number;
    existPriceTab: boolean;
}

// 파싱한 시각 기록하기 (nullable)
export interface Room {
    createdAt?: Date;
}

// 원룸, 투룸 응답
export interface ArticleResponse {
    isMoreData: boolean;
    articleList: ArticleList[];
    mapExposedCount: number;
    nonMapExposedIncluded: boolean;
}

export interface ArticleList {
    articleNo: string;
    articleName: string;
    articleStatus: string;
    realEstateTypeCode: string;
    realEstateTypeName: string;
    articleRealEstateTypeCode: string;
    articleRealEstateTypeName: string;
    tradeTypeCode: string;
    tradeTypeName: string;
    verificationTypeCode: string;
    floorInfo: string;
    priceChangeState: string;
    isPriceModification: boolean;
    dealOrWarrantPrc: string;
    area1: number;
    area2: number;
    direction: string;
    articleConfirmYmd: string;
    siteImageCount: number;
    articleFeatureDesc: string;
    tagList: string[];
    buildingName: string;
    sameAddrCnt: number;
    sameAddrDirectCnt: number;
    sameAddrMaxPrc: string;
    sameAddrMinPrc: string;
    cpid: string;
    cpName: string;
    cpPcArticleUrl: string;
    cpPcArticleBridgeUrl: string;
    cpPcArticleLinkUseAtArticleTitleYn: boolean;
    cpPcArticleLinkUseAtCpNameYn: boolean;
    cpMobileArticleUrl: string;
    cpMobileArticleLinkUseAtArticleTitleYn: boolean;
    cpMobileArticleLinkUseAtCpNameYn: boolean;
    latitude: string;
    longitude: string;
    isLocationShow: boolean;
    realtorName: string;
    realtorId: string;
    tradeCheckedByOwner: boolean;
    isDirectTrade: boolean;
    isInterest: boolean;
    isComplex: boolean;
    detailAddress: string;
    detailAddressYn: string;
    areaName?: string;
}

export interface ArticleList {
    createdAt?: Date;
}

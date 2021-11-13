export interface CommonSearchRequest {
    realEstateType: string;
    tradeType: string;
    tag: string;
    rentPriceMin: string;
    rentPriceMax: string;
    priceMin: string;
    priceMax: string;
    areaMin: string;
    areaMax: string;
    oldBuildYears: string;
    recentlyBuildYears: string;
    minHouseHoldCount: string;
    maxHouseHoldCount: string;
    showArticle: string;
    minMaintenanceCost: string;
    maxMaintenanceCost: string;
}

export interface SearchRequest extends CommonSearchRequest {
    cortarNo: string;
    zoom: string;
    priceType: string;
    markerId: string;
    markerType: string;
    selectedComplexNo: string;
    selectedComplexBuildingNo: string;
    fakeComplexMarker: string;
    sameAddressGroup: string;
    directions: string;
    leftLon: string;
    rightLon: string;
    topLat: string;
    bottomLat: string;
}

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

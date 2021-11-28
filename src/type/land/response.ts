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
    code: string;
    more: boolean;
    TIME: boolean;
    z: number;
    page: number;
    body: Body[];
}

export interface Body {
    atclNo: string;
    cortarNo: string;
    atclNm: string;
    atclStatCd: string;
    rletTpCd: string;
    uprRletTpCd: string;
    rletTpNm: string;
    tradTpCd: string;
    tradTpNm: string;
    vrfcTpCd: string;
    flrInfo: string;
    prc: number;
    rentPrc: number;
    hanPrc: string;
    spc1: number;
    spc2: number;
    direction: string;
    atclCfmYmd: string;
    lat: number;
    lng: number;
    atclFetrDesc: string;
    tagList: string[];
    bildNm: string;
    minute: number;
    sameAddrCnt: number;
    sameAddrDirectCnt: number;
    cpid: string;
    cpNm: string;
    cpCnt: number;
    rltrNm: string;
    directTradYn: string;
    minMviFee: number;
    maxMviFee: number;
    etRoomCnt: number;
    tradePriceHan: string;
    tradeRentPrice: number;
    tradeCheckedByOwner: boolean;
    cpLinkVO: CpLinkVO;
    dtlAddrYn: string;
    dtlAddr: string;
}

export interface CpLinkVO {
    cpId: string;
    mobileArticleUrl?: string;
    mobileArticleLinkTypeCode: string;
    mobileBmsInspectPassYn: string;
    pcArticleLinkUseAtArticleTitle: boolean;
    pcArticleLinkUseAtCpName: boolean;
    mobileArticleLinkUseAtArticleTitle: boolean;
    mobileArticleLinkUseAtCpName: boolean;
}

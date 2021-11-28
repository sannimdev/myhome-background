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
    body: Room[];
}

export interface Room {
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

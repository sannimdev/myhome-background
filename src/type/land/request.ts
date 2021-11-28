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
    oldBuildYears: string | null;
    recentlyBuildYears: string | null;
    minHouseHoldCount: string | null;
    maxHouseHoldCount: string | null;
    showArticle: string;
    minMaintenanceCost: string | null;
    maxMaintenanceCost: string | null;
}

export interface SearchRequest extends CommonSearchRequest {
    cortarNo: string;
    zoom: string;
    priceType: string;
    markerId: string | null;
    markerType: string | null;
    selectedComplexNo: string | null;
    selectedComplexBuildingNo: string | null;
    fakeComplexMarker: string | null;
    sameAddressGroup: string;
    directions: string;
    leftLon: string;
    rightLon: string;
    topLat: string;
    bottomLat: string;
}

//원룸, 투룸
export interface SearchArticleRequest {
    itemId: string;
    mapKey: string;
    lgeo: string;
    rletTpCd: string;
    tradTpCd: string;
    z: string;
    lat: string;
    lon: string;
    btm: string;
    lft: string;
    top: string;
    rgt: string;
    cortarNo: string;
    showR0: string;
    wprcMin: string;
    wprcMax: string;
    spcMin: string;
    spcMax: string;
    tag: string;
}

export type SearchOrder =
    | 'rank'
    | 'dateDesc'
    | /* 낮은가격순 */ 'prc'
    | /* 높은가격순 */ 'prcDesc'
    | /* 넓은면적순 */ 'spcDesc'
    | /* 좁은면적순 */ 'spc';

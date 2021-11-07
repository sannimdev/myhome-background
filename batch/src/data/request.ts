/**
 * 매물 요청에 관한 옵션을 지정
 */

import { CommonSearchRequest, SearchRequest } from '../type/land';

const commonFilter: CommonSearchRequest = {
    realEstateType: 'OPST',
    tradeType: 'B1',
    tag: '::::::::',
    rentPriceMin: '0',
    rentPriceMax: '900000000',
    priceMin: '10000',
    priceMax: '20000',
    areaMin: '33',
    areaMax: '99',
    oldBuildYears: '',
    recentlyBuildYears: '',
    minHouseHoldCount: '',
    maxHouseHoldCount: '',
    showArticle: 'true',
    minMaintenanceCost: '',
    maxMaintenanceCost: '',
};

export const requestParam: SearchRequest = {
    ...commonFilter,
    cortarNo: '4113510200', // 구역 번호 (수내동, 정자동:4113510300)
    zoom: '15',
    priceType: 'RETAIL',
    markerId: '',
    markerType: '',
    selectedComplexNo: '',
    selectedComplexBuildingNo: '',
    fakeComplexMarker: '',
    sameAddressGroup: 'false',
    directions: '',
    leftLon: '127.0733392',
    rightLon: '127.1630752',
    topLat: '37.3958794',
    bottomLat: '37.3737147',
};

import axios, { AxiosResponse } from 'axios';
import { Room, SearchRequest } from '../type/land';
import { BASE_URL, USER_AGENT_CHROME } from './config';

const instance = axios.create({
    baseURL: BASE_URL,
    headers: { 'User-Agent': USER_AGENT_CHROME },
});

const requestParam: SearchRequest = {
    cortarNo: '4113510200', // 구역 번호 (수내동, 정자동:4113510300)
    zoom: '15',
    priceType: 'RETAIL',
    markerId: '',
    markerType: '',
    selectedComplexNo: '',
    selectedComplexBuildingNo: '',
    fakeComplexMarker: '',
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
    showArticle: 'false',
    sameAddressGroup: 'false',
    minMaintenanceCost: '',
    maxMaintenanceCost: '',
    directions: '',
    leftLon: '127.0733392',
    rightLon: '127.1630752',
    topLat: '37.3958794',
    bottomLat: '37.3737147',
};

export async function testLand() {
    try {
        const response: AxiosResponse<Room[]> = await instance.get('', { params: requestParam });
        return response.data;
    } catch (e) {
        console.error('testLand:', e);
    }
}

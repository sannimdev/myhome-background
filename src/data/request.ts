/**
 * 매물 요청에 관한 옵션을 지정
 */

import { SearchArticleRequest, SearchClusterList } from '../type/land';

export const requestParamSample: SearchArticleRequest = {
    mapKey: '',
    lgeo: '2120323200',
    rletTpCd: 'OPST:VL:JGC:DDDGG:SGJT:OR',
    tradTpCd: 'B1',
    z: '14',
    lat: '37.474482',
    lon: '126.9525022',
    btm: '37.4451858',
    lft: '126.9327182',
    top: '37.5037667',
    rgt: '126.9722862',
    cortarNo: '1162000000',
    showR0: '',
    wprcMin: '10000',
    wprcMax: '20000',
    spcMin: '33',
    spcMax: '66',
    tag: 'SMALLSPCRENT',
};

// 매물 유형 다양하게
export const requestParamSample2: SearchArticleRequest = {
    mapKey: '',
    lgeo: '2120323200',
    rletTpCd: 'OPST:VL:JGC:DDDGG:SGJT:OR',
    tradTpCd: '',
    z: '14',
    lat: '37.474482',
    lon: '126.9525022',
    btm: '37.4451858',
    lft: '126.9327182',
    top: '37.5037667',
    rgt: '126.9722862',
    cortarNo: '1162000000',
    showR0: '',
    wprcMin: '10000',
    wprcMax: '50000',
    spcMin: '33',
    spcMax: '99',
    tag: 'SMALLSPCRENT',
};

export const requestParamSample3: SearchArticleRequest = {
    view: 'atcl',
    rletTpCd: 'OPST',
    tradTpCd: 'B1',
    z: '17',
    lat: '37.3788752',
    lon: '127.1154778',
    btm: '37.3759893',
    lft: '127.1091746',
    top: '37.3817611',
    rgt: '127.121781',
    spcMin: '33',
    spcMax: '99',
    pCortarNo: '17_4113510200',
    addon: 'COMPLEX',
    bAddon: 'COMPLEX',
    isOnlyIsale: 'false',
};

// 해당 클러스터의 lgeo를 이용하여 매물의 개수를 구해야 한다.
export const requestClusterList: SearchClusterList = {
    view: 'atcl',
    cortarNo: '1162000000',
    rletTpCd: 'OPST:VL:JGC:DDDGG:SGJT:OR',
    tradTpCd: 'B1',
    z: '14',
    lat: '37.474482',
    lon: '126.9525022',
    btm: '37.4451858',
    lft: '126.9327182',
    top: '37.5037667',
    rgt: '126.9722862',
    wprcMin: '10000',
    wprcMax: '20000',
    spcMin: '33',
    spcMax: '66',
    tag: 'SMALLSPCRENT',
    pCortarNo: '14_1162000000',
};

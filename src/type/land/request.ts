export interface SearchArticleRequest {
    itemId?: string;
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
    page?: string | number;
    sort?: SearchOrder;
    totCnt?: number;
}

export type SearchOrder =
    | 'rank'
    | 'dateDesc'
    | /* 낮은가격순 */ 'prc'
    | /* 높은가격순 */ 'prcDesc'
    | /* 넓은면적순 */ 'spcDesc'
    | /* 좁은면적순 */ 'spc';

export interface SearchClusterList {
    view: string;
    cortarNo: string;
    rletTpCd: string;
    tradTpCd: string;
    z: string;
    lat: string;
    lon: string;
    btm: string;
    lft: string;
    top: string;
    rgt: string;
    wprcMin: string;
    wprcMax: string;
    spcMin: string;
    spcMax: string;
    tag: string;
    pCortarNo: string;
}

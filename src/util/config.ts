export const USER_AGENT_CHROME =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36';

export const NAVER_ARTICLE_LIST_URL = 'https://m.land.naver.com/cluster/ajax/articleList';
export const NAVER_CLUSTER_LIST_URL = 'https://m.land.naver.com/cluster/clusterList';
export const OVERVIEW_IMAGE_URL = 'https://landthumb-phinf.pstatic.net/';

// 상세 매물번호가 들어간 페이지
export const getArticleDetailUrl = (articleNo: number | string) =>
    `https://m.land.naver.com/article/info/${articleNo}?newMobile`;

// 테스트 요청 페이지
export const SAMPLE_OVERVIEW_IMAGE_URL =
    'https://landthumb-phinf.pstatic.net//20170314_117/apt_realimage_1489482919178hrSgt_JPEG/be4150b06869c1190707922d7cca74f4.jpg';

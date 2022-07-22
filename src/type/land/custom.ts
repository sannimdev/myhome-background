export type RoomDetail = {
    property: {
        [key: string]: string;
    };
    facility: {
        [key: string]: Object;
    };
    images: string[];
    address?: string;
    office: RoomOffice;
    applicablePercentage?: string; // 보증금 '89~92%' 이렇게 파싱..될 때도 있음
};

export type RoomOffice = {
    name?: string | null;
    tel?: (string | null)[];
};

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
    applicablePercentage?: number; // 보증금
};

export type RoomOffice = {
    name?: string | null;
    tel?: (string | null)[];
};

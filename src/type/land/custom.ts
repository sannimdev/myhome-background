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
};

export type RoomOffice = {
    name?: string | null;
    tel?: (string | null)[];
};

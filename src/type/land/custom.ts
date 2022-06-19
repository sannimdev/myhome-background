export type RoomDetail = {
    property: {
        [key: string]: string;
    };
    facility: {
        room: string[];
        security: string[];
    };
};

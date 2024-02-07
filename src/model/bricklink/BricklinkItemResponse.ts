import {Meta} from "./Meta";

export interface BricklinkItemResponse {
    meta: Meta;
    data: {
        no: string;
        name: string;
        type: string;
        image_url: string;
        thumbnail_url: string;
        year_released: number;
    };
}
import {Type} from "../_shared/Type";

export interface Item {
    id: number;
    setId?: string;
    name: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    yearReleased?: number;
    pieceCount?: number;
    minifigCount?: number;
    type: Type;
}
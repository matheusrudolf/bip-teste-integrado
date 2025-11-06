import { Pageable } from "../models/pageable"
import { Sort } from "../models/sort";

export class Page<T> {
    public content: T[] = [];

    public pageable?: Pageable;

    public last?: boolean;

    public totalElements?: number = 0;

    public totalPages?: number;

    public firts?: string;

    public size: number = 5;

    public number: number;

    public sort?: Sort;

    public numberOfElements?: number;

    public empty?: string;
}

import { Expose } from "class-transformer";
import OffsetPaginationDto from "./offset-pagination.dto";

export default class OffsetPaginatedDto<TData> {
  @Expose()
  readonly data: TData[];

  @Expose()
  pagination: OffsetPaginationDto;

  constructor(data: TData[], meta: OffsetPaginationDto) {
    this.data = data;
    this.pagination = meta;
  }
}

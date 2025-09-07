import { Expose } from "class-transformer";
import PageOffsetOptionsDto from "./pages-option.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     OffsetPaginationDto:
 *       type: object
 *       description: Pagination metadata
 *       properties:
 *         limit:
 *           type: number
 *           description: Number of items per page
 *         currentPage:
 *           type: number
 *           description: Current page number
 *         nextPage:
 *           type: number
 *           description: Next page number
 *         previousPage:
 *           type: number
 *           description: Previous page number
 *         totalRecords:
 *           type: number
 *           description: Total number of records
 *         totalPages:
 *           type: number
 *           description: Total number of pages
 */
export default class OffsetPaginationDto {
  @Expose()
  readonly limit: number;

  @Expose()
  readonly currentPage: number;

  @Expose()
  readonly nextPage?: number;

  @Expose()
  readonly previousPage?: number;

  @Expose()
  readonly totalRecords: number;

  @Expose()
  readonly totalPages: number;

  constructor(totalRecords: number, pageOptions: PageOffsetOptionsDto) {
    this.limit = Number(pageOptions.limit);
    this.currentPage = Number(pageOptions.page);
    this.totalRecords = Number(totalRecords);
    this.totalPages =
      this.limit > 0 ? Math.ceil(this.totalRecords / this.limit) : 0;

    this.nextPage =
      this.currentPage < this.totalPages ? this.currentPage + 1 : undefined;
    this.previousPage =
      this.currentPage > 1 && this.currentPage - 1 < this.totalPages
        ? this.currentPage - 1
        : undefined;
  }
}

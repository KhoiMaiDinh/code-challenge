import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_LIMIT,
} from '@/constants/pagination.constant';
import { Order } from '@/enums';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     SortField:
 *       type: string
 *       enum:
 *         - createdAt
 */
export enum SortField {
  createdAt = 'createdAt',
}

/**
 * @openapi
 * components:
 *   parameters:
 *     PageParam:
 *       name: page
 *       in: query
 *       required: false
 *       description: Page number
 *       schema:
 *         type: integer
 *         default: 1
 *         example: 1
 *     LimitParam:
 *       name: limit
 *       in: query
 *       required: false
 *       description: Number of items per page
 *       schema:
 *         type: integer
 *         default: 10
 *         example: 10
 *     SortParam:
 *       name: sort
 *       in: query
 *       required: false
 *       description: Field to sort by
 *       schema:
 *         $ref: '#/components/schemas/SortField'
 *     OrderParam:
 *       name: order
 *       in: query
 *       required: false
 *       description: Order direction
 *       schema:
 *         $ref: '#/components/schemas/Order'
 */

export default class PageOffsetOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit?: number = DEFAULT_PAGE_LIMIT;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = DEFAULT_CURRENT_PAGE;

  @IsEnum(SortField)
  readonly sort?: SortField = SortField.createdAt;

  @IsEnum(Order)
  readonly order?: Order = Order.ASC;

  get offset() {
    return (this.page - 1) * this.limit;
  }
}

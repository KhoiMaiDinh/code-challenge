import { ResourceType } from "@/enums";
import { Exclude, Expose } from "class-transformer";

/**
 * @openapi
 * components:
 *   schemas:
 *     ResourceDetailResponse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           $ref: '#/components/schemas/ResourceType'
 *         data:
 *           type: object
 *         _id:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
@Exclude()
export default class ResourceDetailResponse {
  @Expose()
  name: string;

  @Expose()
  type: ResourceType;

  @Expose()
  data: object;

  @Expose()
  _id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

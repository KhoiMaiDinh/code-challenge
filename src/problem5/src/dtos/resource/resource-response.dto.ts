import { ResourceType } from '@/enums';
import { Exclude, Expose } from 'class-transformer';

/**
 * @openapi
 * components:
 *   schemas:
 *     ResourceResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           ref: '#/components/schemas/ResourceType'
 */
@Exclude()
export default class ResourceResponse {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  type: ResourceType;
}

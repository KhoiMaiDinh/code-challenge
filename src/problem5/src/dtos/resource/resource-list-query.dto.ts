import { PageOffsetOptionsDto } from '@/dtos/common';
import { ResourceType } from '@/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

/**
 * @openapi
 * components:
 *   parameters:
 *     ResourceNameParam:
 *       name: name
 *       in: query
 *       required: false
 *       description: Resource name filter
 *       schema:
 *         type: string
 *         example: resource name
 *     ResourceTypeParam:
 *       name: type
 *       in: query
 *       required: false
 *       description: Resource type filter
 *       schema:
 *         $ref: '#/components/schemas/ResourceType'
 */
export default class ResourceListQuery extends PageOffsetOptionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ResourceType, { message: 'type must be a valid ResourceType' })
  type?: ResourceType;
}

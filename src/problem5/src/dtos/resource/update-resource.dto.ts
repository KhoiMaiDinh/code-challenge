import { ResourceType } from "@/enums";
import { IsEnum, IsObject, IsString } from "class-validator";

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateResource:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           $ref: '#/components/schemas/ResourceType'
 *         data:
 *           type: object
 */
export default class UpdateResource {
  @IsString()
  name?: string;
  @IsEnum(ResourceType)
  type?: ResourceType;
  @IsObject()
  data?: Object;
}

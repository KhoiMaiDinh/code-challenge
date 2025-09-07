import { IsObjectId } from "@/decorators";
import { IsString } from "class-validator";

export default class IdParam {
  @IsString()
  @IsObjectId()
  id: string;
}

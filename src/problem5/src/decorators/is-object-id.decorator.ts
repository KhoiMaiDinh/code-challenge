// src/decorators/is-objectid.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import mongoose from "mongoose";

const IsObjectId = (validationOptions?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isObjectId",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          return (
            typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid MongoDB ObjectId`;
        },
      },
    });
  };
};
export default IsObjectId;

import { Schema } from "mongoose";

export default function createBaseSchema<
  T extends Record<string, unknown> = {},
>(extraFields: T = {} as T) {
  return new Schema(
    {
      ...extraFields,
    },
    {
      timestamps: true,
    },
  );
}

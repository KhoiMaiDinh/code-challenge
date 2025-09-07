import mongoose, { InferSchemaType } from 'mongoose';

import { Model, ResourceType } from '@/enums';
import createBaseSchema from '@/models/base.schema';

const ResourceSchema = createBaseSchema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ResourceType,
    required: true,
    index: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

ResourceSchema.index({ createdAt: -1 }, { name: 'createdAt_desc' });

export type Resource = InferSchemaType<typeof ResourceSchema>;
export const ResourceModel = mongoose.model<Resource>(
  Model.Resource,
  ResourceSchema
);
export default ResourceModel;

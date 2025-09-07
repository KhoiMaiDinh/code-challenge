import { Document, Model } from 'mongoose';

import { Resource } from '@/models/resource.model';
declare global {
  namespace Models {
    export type ResourceModel = Model<Resource & Document>;
  }
}

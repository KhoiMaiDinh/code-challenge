import mongoose from 'mongoose';
import { Inject, Service } from 'typedi';

import { Order } from '@/enums';
import { ResourceListQuery } from '@/dtos';
import { IResouceRepository } from '@/interfaces';
import { Resource } from '@/models/resource.model';

@Service()
export default class ResourceRepository implements IResouceRepository {
  constructor(
    @Inject('resourceModel') private resourceModel: Models.ResourceModel
  ) {}
  async create(
    resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Resource> {
    const created = new this.resourceModel(resource);
    const saved = await created.save();
    return saved.toObject();
  }

  async findAll(filters: ResourceListQuery): Promise<Resource[]> {
    const query: mongoose.FilterQuery<Resource> = {};

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    const sort: Record<string, 1 | -1> = {};
    sort[filters.sort] = filters.order === Order.ASC ? 1 : -1;

    const skip = filters.offset;
    const limit = filters.limit || 10;

    return await this.resourceModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async count(filters: ResourceListQuery): Promise<number> {
    const query: mongoose.FilterQuery<Resource> = {};

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    return this.resourceModel.countDocuments(query).exec();
  }

  async findById(id: string): Promise<Resource | null> {
    const resource = await this.resourceModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .exec();
    return resource?.toObject() || null;
  }

  async update(
    id: string,
    resource: Partial<Omit<Resource, 'id'>>
  ): Promise<Resource | null> {
    const updated = await this.resourceModel
      .findByIdAndUpdate(id, resource, { new: true })
      .exec();
    return updated?.toObject() || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const deleted = await this.resourceModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      )
      .exec();
    return deleted !== null;
  }
}

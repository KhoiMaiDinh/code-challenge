import { ResourceListQuery } from '@/dtos';
import { Resource } from '@/models/resource.model';

export interface IResouceRepository {
  create(
    resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Resource>;
  findAll(filters: ResourceListQuery): Promise<Resource[]>;
  findById(id: string): Promise<Resource | null>;
  update(
    id: string,
    resource: Partial<Omit<Resource, 'id'>>
  ): Promise<Resource | null>;
  softDelete(id: string): Promise<boolean>;
  count(filters: ResourceListQuery): Promise<number>;
}

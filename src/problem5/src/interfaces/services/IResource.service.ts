import { CreateResource, ResourceListQuery, UpdateResource } from '@/dtos';
import { Resource } from '@/models/resource.model';

export interface IResourceService {
  create(resourceDto: CreateResource): Promise<Resource>;
  getAll(
    filters: ResourceListQuery
  ): Promise<{ resources: Resource[]; count: number }>;
  getOne(id: string): Promise<Resource>;
  update(id: string, resourceDto: UpdateResource): Promise<Resource>;
  delete(id: string): Promise<void>;
}

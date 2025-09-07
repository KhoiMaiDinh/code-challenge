import { Service } from 'typedi';

import { CreateResource, ResourceListQuery, UpdateResource } from '@/dtos';
import { Errors } from '@/errors/factory';
import { IResourceService } from '@/interfaces';
import { ResourceRepository } from '@/repositories';

@Service()
class ResourceService implements IResourceService {
  constructor(private resourceRepository: ResourceRepository) {}
  async create({ name, type, data }: CreateResource) {
    const created = await this.resourceRepository.create({ name, type, data });
    return created;
  }

  async getAll(filters: ResourceListQuery) {
    const resources = await this.resourceRepository.findAll(filters);
    const count = await this.resourceRepository.count(filters);
    return { resources, count };
  }

  async getOne(id: string) {
    const resource = await this.resourceRepository.findById(id);

    if (!resource) throw Errors.Resource.NotFound({ id });

    return resource;
  }

  async update(id: string, { name, type, data }: UpdateResource) {
    const resource = await this.getOne(id);

    const updated = await this.resourceRepository.update(id, {
      name,
      type,
      data,
    });
    return updated;
  }

  async delete(id: string) {
    await this.getOne(id);
    await this.resourceRepository.softDelete(id);
  }
}

export default ResourceService;

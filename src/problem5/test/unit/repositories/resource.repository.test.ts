import { Container } from 'typedi';

import { ResourceType, Order } from '@/enums';
import ResourceRepository from '@/repositories/resource.repository';
import { SortField } from '@/dtos/common/pages-option.dto';

// Create a mock query object for chainable mongoose queries
const mockQuery = {
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

// Create a mock model with mongoose-like methods
const mockResourceModel = {
  find: jest.fn().mockReturnValue(mockQuery),
  findOne: jest.fn().mockReturnValue(mockQuery),
  findByIdAndUpdate: jest.fn().mockReturnValue(mockQuery),
  countDocuments: jest.fn().mockReturnValue(mockQuery),
};

// Mock for creating a new model instance
const mockModelInstance = {
  save: jest.fn(),
  toObject: jest.fn(),
};

// Mock constructor for the model (used in `create()`)
function MockResourceModel(data) {
  return mockModelInstance;
}
MockResourceModel.find = mockResourceModel.find;
MockResourceModel.findOne = mockResourceModel.findOne;
MockResourceModel.findByIdAndUpdate = mockResourceModel.findByIdAndUpdate;
MockResourceModel.countDocuments = mockResourceModel.countDocuments;

describe('ResourceRepository', () => {
  let resourceRepository: ResourceRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    Container.set('resourceModel', MockResourceModel);
    resourceRepository = Container.get(ResourceRepository);
  });

  afterEach(() => {
    Container.reset();
  });

  // ============================
  // CREATE
  // ============================
  describe('create', () => {
    it('should create a new resource', async () => {
      const resourceData = {
        name: 'Test Resource',
        type: ResourceType.A,
        data: { key: 'value' },
      };

      const savedResource = {
        _id: '123',
        name: 'Test Resource',
        type: ResourceType.A,
        data: { key: 'value' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockModelInstance.save.mockResolvedValue({
        ...savedResource,
        toObject: jest.fn().mockReturnValue(savedResource),
      });

      const result = await resourceRepository.create(resourceData);

      expect(mockModelInstance.save).toHaveBeenCalled();
      expect(result).toEqual(savedResource);
    });
  });

  // ============================
  // FIND ALL
  // ============================
  describe('findAll', () => {
    it('should find resources with only name filter', async () => {
      const filters = {
        name: 'Alpha',
        offset: 0,
        limit: 5,
        sort: SortField.createdAt,
        order: Order.DESC,
      };

      const resources = [{ _id: '1', name: 'Alpha', type: ResourceType.A }];

      mockQuery.exec.mockResolvedValue(resources);

      const result = await resourceRepository.findAll(filters);

      expect(mockResourceModel.find).toHaveBeenCalledWith({
        name: { $regex: 'Alpha', $options: 'i' },
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(result).toEqual(resources);
    });

    it('should find resources with only type filter', async () => {
      const filters = {
        type: ResourceType.B,
        offset: 2,
        limit: 3,
        sort: SortField.createdAt,
        order: Order.ASC,
      };

      const resources = [{ _id: '2', name: 'Beta', type: ResourceType.B }];

      mockQuery.exec.mockResolvedValue(resources);

      const result = await resourceRepository.findAll(filters);

      expect(mockResourceModel.find).toHaveBeenCalledWith({
        type: ResourceType.B,
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(mockQuery.skip).toHaveBeenCalledWith(2);
      expect(mockQuery.limit).toHaveBeenCalledWith(3);
      expect(result).toEqual(resources);
    });

    it('should use default limit when limit is undefined', async () => {
      const filters = {
        offset: 0,
        sort: SortField.createdAt,
        order: Order.ASC,
      };

      const resources = [{ _id: '3', name: 'Gamma', type: ResourceType.B }];

      mockQuery.exec.mockResolvedValue(resources);

      const result = await resourceRepository.findAll(filters);

      expect(mockResourceModel.find).toHaveBeenCalledWith({});
      expect(mockQuery.limit).toHaveBeenCalledWith(10); // ✅ default limit
      expect(result).toEqual(resources);
    });

    it('should handle missing sort field gracefully', async () => {
      const filters = {
        offset: 0,
        limit: 10,
        order: Order.ASC,
      };

      const resources = [{ _id: '4', name: 'Delta', type: ResourceType.B }];

      mockQuery.exec.mockResolvedValue(resources);

      const result = await resourceRepository.findAll(filters);

      expect(mockResourceModel.find).toHaveBeenCalledWith({});
      // Sorting with undefined key
      expect(mockQuery.sort).toHaveBeenCalledWith({ undefined: 1 });
      expect(result).toEqual(resources);
    });
  });

  // ============================
  // COUNT
  // ============================
  describe('count', () => {
    it('should count resources with filters', async () => {
      const filters = {
        name: 'Test',
        type: ResourceType.A,
        offset: 0,
        limit: 10,
      };

      mockQuery.exec.mockResolvedValue(5);

      const result = await resourceRepository.count(filters);

      expect(mockResourceModel.countDocuments).toHaveBeenCalledWith({
        name: { $regex: 'Test', $options: 'i' },
        type: ResourceType.A,
      });

      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should count all resources when no filters are provided', async () => {
      const filters = { offset: 0, limit: 10 };

      mockQuery.exec.mockResolvedValue(10);

      const result = await resourceRepository.count(filters);

      expect(mockResourceModel.countDocuments).toHaveBeenCalledWith({});
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toBe(10);
    });
  });

  // ============================
  // FIND BY ID
  // ============================
  describe('findById', () => {
    it('should find a resource by id', async () => {
      const resourceId = '123';
      const resource = {
        _id: resourceId,
        name: 'Test Resource',
        type: ResourceType.A,
        data: {},
        toObject: jest.fn().mockReturnValue({
          id: resourceId,
          name: 'Test Resource',
          type: ResourceType.A,
          data: {},
        }),
      };

      mockQuery.exec.mockResolvedValue(resource);

      const result = await resourceRepository.findById(resourceId);

      expect(mockResourceModel.findOne).toHaveBeenCalledWith({
        _id: resourceId,
        isDeleted: { $ne: true },
      });
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(resource.toObject).toHaveBeenCalled();
      expect(result).toEqual({
        id: resourceId,
        name: 'Test Resource',
        type: ResourceType.A,
        data: {},
      });
    });

    it('should return null if resource not found', async () => {
      const resourceId = '123';
      mockQuery.exec.mockResolvedValue(null);

      const result = await resourceRepository.findById(resourceId);

      expect(mockResourceModel.findOne).toHaveBeenCalledWith({
        _id: resourceId,
        isDeleted: { $ne: true },
      });
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  // ============================
  // UPDATE
  // ============================
  describe('update', () => {
    it('should update a resource', async () => {
      const resourceId = '123';
      const updateData = {
        name: 'Updated Resource',
        type: ResourceType.B,
      };

      const updatedResource = {
        _id: resourceId,
        name: 'Updated Resource',
        type: ResourceType.B,
        data: {},
        toObject: jest.fn().mockReturnValue({
          id: resourceId,
          name: 'Updated Resource',
          type: ResourceType.B,
          data: {},
        }),
      };

      mockQuery.exec.mockResolvedValue(updatedResource);

      const result = await resourceRepository.update(resourceId, updateData);

      expect(mockResourceModel.findByIdAndUpdate).toHaveBeenCalledWith(
        resourceId,
        updateData,
        { new: true }
      );
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(updatedResource.toObject).toHaveBeenCalled();
      expect(result).toEqual({
        id: resourceId,
        name: 'Updated Resource',
        type: ResourceType.B,
        data: {},
      });
    });

    it('should return null if resource to update not found', async () => {
      const resourceId = '123';
      const updateData = { name: 'Updated Resource' };

      mockQuery.exec.mockResolvedValue(null);

      const result = await resourceRepository.update(resourceId, updateData);

      expect(mockResourceModel.findByIdAndUpdate).toHaveBeenCalledWith(
        resourceId,
        updateData,
        { new: true }
      );
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  // ============================
  // SOFT DELETE
  // ============================
  describe('softDelete', () => {
    it('should soft delete a resource', async () => {
      const resourceId = '123';
      const deletedResource = {
        _id: resourceId,
        isDeleted: true,
        deletedAt: new Date(),
      };

      mockQuery.exec.mockResolvedValue(deletedResource);

      const result = await resourceRepository.softDelete(resourceId);

      expect(mockResourceModel.findByIdAndUpdate).toHaveBeenCalledWith(
        resourceId,
        { isDeleted: true, deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if resource to delete not found', async () => {
      const resourceId = '123';
      mockQuery.exec.mockResolvedValue(null);

      const result = await resourceRepository.softDelete(resourceId);

      expect(mockResourceModel.findByIdAndUpdate).toHaveBeenCalledWith(
        resourceId,
        { isDeleted: true, deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});

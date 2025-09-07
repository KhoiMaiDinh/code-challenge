import { Container } from 'typedi';

import ResourceService from '@/services/v1/resouce.service';
import { ResourceRepository } from '@/repositories';
import { Order, ResourceType } from '@/enums';
import { SortField } from '@/dtos/common/pages-option.dto';

// Mock the repository
const mockResourceRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('ResourceService', () => {
  let resourceService: ResourceService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up the container with our mock
    Container.set(ResourceRepository, mockResourceRepository);

    // Get the service from the container
    resourceService = Container.get(ResourceService);
  });

  afterEach(() => {
    // Clear container to prevent test pollution
    Container.reset();
  });

  describe('create', () => {
    it('should create a resource successfully', async () => {
      // Arrange
      const resourceData = {
        name: 'Test Resource',
        type: ResourceType.A,
        data: { key: 'value' },
      };

      const createdResource = {
        id: '123',
        name: 'Test Resource',
        type: ResourceType.A,
        data: { key: 'value' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockResourceRepository.create.mockResolvedValue(createdResource);

      // Act
      const result = await resourceService.create(resourceData);

      // Assert
      expect(mockResourceRepository.create).toHaveBeenCalledWith(resourceData);
      expect(result).toEqual(createdResource);
    });
  });

  describe('getAll', () => {
    it('should return resources and count', async () => {
      // Arrange
      const filters = {
        offset: 0,
        limit: 10,
        sort: SortField.createdAt,
        order: Order.ASC,
      };

      const resources = [
        { id: '1', name: 'Resource 1', type: ResourceType.A, data: {} },
        { id: '2', name: 'Resource 2', type: ResourceType.B, data: {} },
      ];

      mockResourceRepository.findAll.mockResolvedValue(resources);
      mockResourceRepository.count.mockResolvedValue(2);

      // Act
      const result = await resourceService.getAll(filters);

      // Assert
      expect(mockResourceRepository.findAll).toHaveBeenCalledWith(filters);
      expect(mockResourceRepository.count).toHaveBeenCalledWith(filters);
      expect(result).toEqual({ resources, count: 2 });
    });
  });

  describe('getOne', () => {
    it('should return a resource by id', async () => {
      // Arrange
      const resourceId = '123';
      const resource = {
        id: resourceId,
        name: 'Test Resource',
        type: ResourceType.A,
        data: {},
      };

      mockResourceRepository.findById.mockResolvedValue(resource);

      // Act
      const result = await resourceService.getOne(resourceId);

      // Assert
      expect(mockResourceRepository.findById).toHaveBeenCalledWith(resourceId);
      expect(result).toEqual(resource);
    });

    it('should throw an error if resource not found', async () => {
      // Arrange
      const resourceId = '123';
      mockResourceRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(resourceService.getOne(resourceId)).rejects.toThrow();
      expect(mockResourceRepository.findById).toHaveBeenCalledWith(resourceId);
    });
  });

  describe('update', () => {
    it('should update a resource successfully', async () => {
      // Arrange
      const resourceId = '123';
      const updateData = {
        name: 'Updated Resource',
        type: ResourceType.B,
        data: { updated: true },
      };

      const existingResource = {
        id: resourceId,
        name: 'Test Resource',
        type: ResourceType.A,
        data: { original: true },
      };

      const updatedResource = {
        id: resourceId,
        ...updateData,
      };

      mockResourceRepository.findById.mockResolvedValue(existingResource);
      mockResourceRepository.update.mockResolvedValue(updatedResource);

      // Act
      const result = await resourceService.update(resourceId, updateData);

      // Assert
      expect(mockResourceRepository.findById).toHaveBeenCalledWith(resourceId);
      expect(mockResourceRepository.update).toHaveBeenCalledWith(
        resourceId,
        updateData
      );
      expect(result).toEqual(updatedResource);
    });

    it('should throw an error if resource to update not found', async () => {
      // Arrange
      const resourceId = '123';
      const updateData = {
        name: 'Updated Resource',
        type: ResourceType.B,
        data: {},
      };

      mockResourceRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        resourceService.update(resourceId, updateData)
      ).rejects.toThrow();
      expect(mockResourceRepository.findById).toHaveBeenCalledWith(resourceId);
      expect(mockResourceRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a resource successfully', async () => {
      // Arrange
      const resourceId = '123';
      const resource = {
        id: resourceId,
        name: 'Test Resource',
        type: ResourceType.A,
        data: {},
      };

      mockResourceRepository.findById.mockResolvedValue(resource);
      mockResourceRepository.softDelete.mockResolvedValue(true);

      // Act
      await resourceService.delete(resourceId);

      // Assert
      expect(mockResourceRepository.findById).toHaveBeenCalledWith(resourceId);
      expect(mockResourceRepository.softDelete).toHaveBeenCalledWith(
        resourceId
      );
    });

    it('should throw an error if resource to delete not found', async () => {
      // Arrange
      const resourceId = '123';
      mockResourceRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(resourceService.delete(resourceId)).rejects.toThrow();
      expect(mockResourceRepository.findById).toHaveBeenCalledWith(resourceId);
      expect(mockResourceRepository.softDelete).not.toHaveBeenCalled();
    });
  });
});

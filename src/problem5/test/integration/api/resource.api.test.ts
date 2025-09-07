import express from 'express';
import request from 'supertest';
import { Container } from 'typedi';

import { ResourceType } from '@/enums';
import { errorHandler } from '@/api/middlewares';
import ResourceService from '@/services/v1/resouce.service';
import { Errors } from '@/errors/factory';

describe('Resource API', () => {
  let app: express.Application;
  const mockResourceService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(() => {
    // Inject mock service into typedi container BEFORE requiring routes
    Container.set(ResourceService, mockResourceService);

    app = express();
    app.use(express.json());

    // Use real routes, but hooked with mocked service
    const resourceRoutes = require('@/api/routes/v1/resource.route').default;
    resourceRoutes(app);

    // Use the actual global error handler
    app.use(errorHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Container.reset();
  });

  describe('POST /api/v1/resources', () => {
    it('should create a resource', async () => {
      const resourceData = {
        name: 'Test Resource',
        type: ResourceType.A,
        data: { key: 'value' },
      };

      const createdResource = {
        id: '123',
        ...resourceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockResourceService.create.mockResolvedValue(createdResource);

      const res = await request(app)
        .post('/resources')
        .send(resourceData)
        .expect(201);

      expect(mockResourceService.create).toHaveBeenCalledWith(resourceData);

      // ✅ Expect the serialized response, not the raw mock
      expect(res.body).toEqual({
        name: 'Test Resource',
        type: 'A',
      });
    });
  });

  describe('GET /api/v1/resources', () => {
    it('should fetch resources with pagination', async () => {
      const resources = [
        { _id: '1', name: 'Resource 1', type: ResourceType.A, data: {} },
        { _id: '2', name: 'Resource 2', type: ResourceType.B, data: {} },
      ];

      mockResourceService.getAll.mockResolvedValue({ resources, count: 5 });

      const res = await request(app).get('/resources').expect(200);

      expect(mockResourceService.getAll).toHaveBeenCalled();
      expect(res.body).toEqual({
        data: [
          { _id: '1', name: 'Resource 1', type: 'A' },
          { _id: '2', name: 'Resource 2', type: 'B' },
        ],
        pagination: {
          currentPage: 1,
          limit: 10,
          totalPages: 1,
          totalRecords: 5,
        },
      });
    });
  });

  describe('GET /api/v1/resources/:id', () => {
    it('should fetch one resource by ID', async () => {
      const resourceId = '64f1b5e7c2a7d8f9a1b23456';
      const resource = {
        id: resourceId,
        name: 'Test Resource',
        type: ResourceType.A,
        data: {},
      };

      mockResourceService.getOne.mockResolvedValue(resource);

      const res = await request(app)
        .get(`/resources/${resourceId}`)
        .expect(200);

      expect(mockResourceService.getOne).toHaveBeenCalledWith(resourceId);
      expect(res.body).toEqual({
        name: 'Test Resource',
        type: 'A',
        data: {},
      });
    });

    it('should return 404 if not found', async () => {
      mockResourceService.getOne.mockRejectedValue(Errors.Resource.NotFound());

      const res = await request(app)
        .get('/resources/64f1b5e7c2a7d8f9a1b23456')
        .expect(404);

      expect(res.body).toHaveProperty('message', 'Resource not found');
    });
  });

  describe('PUT /api/v1/resources/:id', () => {
    it('should update a resource successfully', async () => {
      const resourceId = '64f1b5e7c2a7d8f9a1b23456';
      const updateData = {
        name: 'Updated Resource',
        type: ResourceType.B,
        data: { updated: true },
      };

      const updatedResource = {
        id: resourceId,
        ...updateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockResourceService.update.mockResolvedValue(updatedResource);

      const res = await request(app)
        .put(`/resources/${resourceId}`)
        .send(updateData)
        .expect(200);

      expect(mockResourceService.update).toHaveBeenCalledWith(
        resourceId,
        updateData
      );
      expect(res.body).toEqual({
        ...updateData,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 when updating a non-existing resource', async () => {
      const resourceId = '64f1b5e7c2a7d8f9a1b23456';
      mockResourceService.update.mockRejectedValue(Errors.Resource.NotFound());

      const res = await request(app)
        .put(`/resources/${resourceId}`)
        .send({
          name: 'Does not exist',
          type: ResourceType.A,
          data: {},
        })
        .expect(404);

      expect(res.body).toHaveProperty('message', 'Resource not found');
    });
  });

  describe('DELETE /api/v1/resources/:id', () => {
    it('should delete a resource successfully', async () => {
      const resourceId = '64f1b5e7c2a7d8f9a1b23456';
      mockResourceService.delete.mockResolvedValue(undefined);

      await request(app).delete(`/resources/${resourceId}`).expect(204);

      expect(mockResourceService.delete).toHaveBeenCalledWith(resourceId);
    });

    it('should return 404 if resource does not exist', async () => {
      const resourceId = '64f1b5e7c2a7d8f9a1b23456';
      mockResourceService.delete.mockRejectedValue(Errors.Resource.NotFound());

      const res = await request(app)
        .delete(`/resources/${resourceId}`)
        .expect(404);

      expect(res.body).toHaveProperty('message', 'Resource not found');
    });
  });
});

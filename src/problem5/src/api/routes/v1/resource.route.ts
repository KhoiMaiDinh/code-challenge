import { Router, Response } from 'express';
import Container from 'typedi';

import * as middlewares from '@/api/middlewares';
import { serialize, serializeArray } from '@/utils/serializer.util';

import ResourceService from '@/services/v1/resouce.service';
import {
  CreateResource,
  ResourceDetailResponse,
  ResourceListQuery,
  ResourceResponse,
  UpdateResource,
  IdParam,
  OffsetPaginatedDto,
  OffsetPaginationDto,
} from '@/dtos';
import { Request } from '@/types/express';

const route = Router();

export default (app: Router) => {
  app.use('/resources', route);

  const resouceService = Container.get(ResourceService);

  /**
   * @openapi
   * /api/v1/resources:
   *   post:
   *     tags:
   *       - Resources
   *     description: Create a resource
   *     responses:
   *       201:
   *         description: Resource created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResourceDetailResponse'
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateResource'
   */
  route.post(
    '/',
    middlewares.validateDto({ body: CreateResource }),
    async (req: Request<CreateResource, unknown, unknown>, res: Response) => {
      const input: CreateResource = req.dtoBody;
      const resource = await resouceService.create(input);
      return res.status(201).json(serialize(ResourceResponse, resource));
    }
  );

  /**
   * @openapi
   * /api/v1/resources/{id}:
   *   get:
   *     tags:
   *       - Resources
   *     description: Get a resource by id
   *     responses:
   *       200:
   *         description: Returns the Resource
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResourceDetailResponse'
   *       404:
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   */
  route.get(
    '/:id',
    middlewares.validateDto({ params: IdParam }),
    async (req: Request<unknown, IdParam, unknown>, res: Response) => {
      const { id } = req.dtoParams;
      const resource = await resouceService.getOne(id);

      return res.status(200).json(serialize(ResourceDetailResponse, resource));
    }
  );

  /**
   * @openapi
   * /api/v1/resources:
   *   get:
   *     tags:
   *       - Resources
   *     description: Get all resources
   *     responses:
   *       200:
   *         description: Returns a paginated list of resources
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ResourceResponse'
   *                 pagination:
   *                   $ref: '#/components/schemas/OffsetPaginationDto'
   *     parameters:
   *       - $ref: '#/components/parameters/ResourceNameParam'
   *       - $ref: '#/components/parameters/ResourceTypeParam'
   *       - $ref: '#/components/parameters/PageParam'
   *       - $ref: '#/components/parameters/LimitParam'
   *       - $ref: '#/components/parameters/SortParam'
   *       - $ref: '#/components/parameters/OrderParam'
   */
  route.get(
    '/',
    middlewares.validateDto({ query: ResourceListQuery }),
    async (
      req: Request<unknown, unknown, ResourceListQuery>,
      res: Response
    ) => {
      const resourceListQuery = req.dtoQuery;
      const resourceQueryResult =
        await resouceService.getAll(resourceListQuery);
      const paginationMetadata = new OffsetPaginationDto(
        resourceQueryResult.count,
        resourceListQuery
      );
      const paginatedResourceList = new OffsetPaginatedDto<ResourceResponse>(
        serializeArray(ResourceResponse, resourceQueryResult.resources),
        paginationMetadata
      );
      return res.status(200).json(paginatedResourceList);
    }
  );

  /**
   * @openapi
   * /api/v1/resources/{id}:
   *   put:
   *     tags:
   *       - Resources
   *     description: Update a resource by id
   *     responses:
   *       200:
   *         description: Returns the updated resource
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResourceDetailResponse'
   *       404:
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateResource'
   */
  route.put(
    '/:id',
    middlewares.validateDto({ params: IdParam, body: UpdateResource }),
    async (req: Request<UpdateResource, IdParam, unknown>, res: Response) => {
      const { id } = req.dtoParams;
      const input: UpdateResource = req.dtoBody;
      const resource = await resouceService.update(id, input);
      return res.status(200).json(serialize(ResourceDetailResponse, resource));
    }
  );

  /**
   * @openapi
   * /api/v1/resources/{id}:
   *   delete:
   *     tags:
   *       - Resources
   *     description: Delete a resource by id
   *     responses:
   *       204:
   *         description: Resource deleted
   *       404:
   *         description: Resource not found
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   */
  route.delete(
    '/:id',
    middlewares.validateDto({ params: IdParam }),
    async (req: Request<unknown, IdParam, unknown>, res: Response) => {
      const { id } = req.dtoParams;
      await resouceService.delete(id);
      return res.status(204).send();
    }
  );
};

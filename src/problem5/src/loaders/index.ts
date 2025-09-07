import { Model } from "mongoose";

import Logger from "@/loaders/logger";
import expressLoader from "@/loaders/express";
import mongooseLoader from "@/loaders/mongoose";
import dependencyInjectorLoader from "@/loaders/dependencyInjector";
import ResourceModel, { Resource } from "@/models/resource.model";

export interface ModelEntry<T = any> {
  name: string;
  model: Model<T>;
}

export default async ({ expressApp }) => {
  await mongooseLoader();
  Logger.info("✌️ DB loaded and connected!");

  const resourceModel: ModelEntry<Resource> = {
    name: "resourceModel",
    model: ResourceModel,
  };

  dependencyInjectorLoader({
    models: [resourceModel],
  });

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};

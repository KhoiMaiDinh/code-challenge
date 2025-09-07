import { Router } from "express";
import resource from "./resource.route";

export default (app: Router) => {
  const route = Router();

  resource(route);

  app.use("/v1", route);
};

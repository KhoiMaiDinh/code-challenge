import { Router } from "express";
import v1Router from "@/api/routes/v1";

export default () => {
  const appRouter = Router();

  v1Router(appRouter);

  return appRouter;
};

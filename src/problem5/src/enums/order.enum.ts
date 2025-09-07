/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: string
 *       enum: [ASC, DESC]
 *       description: Sort order
 */
export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

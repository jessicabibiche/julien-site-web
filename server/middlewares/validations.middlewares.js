import { z } from "zod";
import { StatusCodes } from "http-status-codes";

const validate =
  ({ bodySchema, paramsSchema, querySchema, headersSchema }) =>
  (req, res, next) => {
    try {
      if (bodySchema) {
        const parsedBody = bodySchema.parse(req.body);
        req.body = parsedBody;
      }

      if (paramsSchema) {
        const parsedParams = paramsSchema.parse(req.params);
        req.params = parsedParams;
      }

      if (querySchema) {
        const parsedQuery = querySchema.parse(req.query);
        req.query = parsedQuery;
      }

      if (headersSchema) {
        const parsedHeaders = headersSchema.parse(req.headers);
        req.headers = parsedHeaders;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid request data",
          errors: error.errors,
        });
      }
      next(error);
    }
  };

export default validate;

export const ERROR_DEFINITIONS = {
  Resource: {
    NotFound: {
      statusCode: 404,
      message: 'Resource not found',
    },
  },
  Common: {
    ValidationFailed: {
      statusCode: 422,
      message: 'Validation failed',
    },
    InternalError: {
      statusCode: 500,
      message: 'Internal server error',
    },
    NotFound: {
      statusCode: 404,
      message: 'API Not found',
    },
  },
};

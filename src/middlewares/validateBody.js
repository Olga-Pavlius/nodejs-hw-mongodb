import createHttpError from 'http-errors';

// export function validateBody(schema) {
//   return async (req, res, next) => {
//     try {
//       await schema.validateAsync(req.body, {
//         abortEarly: false,
//       });

//       next();
//     } catch (error) {
//       const errors = error.details.map((detail) => detail.message);

//       next(createHttpError.BadRequest(errors));
//     }
//   };
// }
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log('🛑 Validation error:', error.details);
      return next(createHttpError(400, error.message));
    }
    next();
  };
};
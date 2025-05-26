// import { isValidObjectId } from 'mongoose';
// import createHttpError from 'http-errors';

// export const isValidId = (req, res, next) => {
//   const { contactId } = req.params;
//   if (!isValidObjectId(contactId)) {
//     throw createHttpError(400, 'Bad Request');
//   }

//   next();
// };

// import createHttpError from 'http-errors';
// import { isValidObjectId } from 'mongoose';

// export function isValidID(req, res, next) {
//   if (isValidObjectId(req.params.id) !== true) {
//     return next(createHttpError.BadRequest('ID should be an ObjectId'));
//   }

//   next();
// }
import mongoose from 'mongoose';

export function isValidID(req, res, next) {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: 'Invalid contact ID format' });
  }

  next();
}
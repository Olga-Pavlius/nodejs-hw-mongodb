import express from 'express';

import {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
  replaceContactController,
} from '../controllers/contacts.controller.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidID } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';

import { contactSchema, updateContactSchema } from '../validation/contacts.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', isValidID, ctrlWrapper(getContactByIdController));

router.delete('/:id', isValidID, ctrlWrapper(deleteContactController));

router.post(
  '/',
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  isValidID,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.put(
  '/:id',
  isValidID,
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(replaceContactController),
);

export default router;
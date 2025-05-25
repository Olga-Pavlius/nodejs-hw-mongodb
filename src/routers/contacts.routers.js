import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.put(
  '/:contactId', validateObjectId,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/:contactId', validateObjectId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

router.get(
  '/:contactId', validateObjectId,
  isValidId,
  ctrlWrapper(getContactByIdController),
);


export default router;

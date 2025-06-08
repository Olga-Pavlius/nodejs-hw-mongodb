import express from 'express';

import { upload } from '../middlewares/upload.js';

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
import { auth } from '../middlewares/auth.js'; 

import { contactSchema, updateContactSchema } from '../validation/contacts.js';

const router = express.Router();
const jsonParser = express.json();

router.use(auth);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', isValidID, ctrlWrapper(getContactByIdController));

router.delete('/:id', isValidID, ctrlWrapper(deleteContactController));

router.post(
  '/',
  upload.single('photo'),
  validateBody(contactSchema),
  createContactController
);

router.patch(
  '/:id',
  isValidID,
  jsonParser,
  upload.single('photo'),
  validateBody(updateContactSchema),
  updateContactController
);

router.put(
  '/:id',
  isValidID,
  upload.single('photo'),
  validateBody(contactSchema),
  replaceContactController
);

export default router;

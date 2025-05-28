import express from 'express';

import {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  patchContactController,      
  upsertContactController,     
} from '../controllers/contacts.controller.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', validateObjectId,
   ctrlWrapper(getContactByIdController));

router.post('/', jsonParser, 
  validateBody(createContactSchema), 
  ctrlWrapper(createContactController));

router.patch('/:contactId', 
  validateObjectId, 
  jsonParser, 
  validateBody(updateContactSchema), 
  ctrlWrapper(patchContactController));
  
router.put(
  '/:contactId',
  validateObjectId,
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

router.delete('/:contactId', validateObjectId, ctrlWrapper(deleteContactController));

export default router;

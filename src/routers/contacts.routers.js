// import { Router } from 'express';
// import { getContactById, getAllContacts } from '../controllers/contacts.js';

// const router = Router();

// router.get('/contacts', async (req, res) => {
//  const contacts = await getAllContacts();

//  res.status(200).json({
//   data: contacts,
//  });
// });

// router.get('/contacts/:contactId', async (req, res, next) => {
//  const { contactId } = req.params;
//  const contact = await getContactById(contactId);

//  // Відповідь, якщо контакт не знайдено
//  if (!contact) {
//   res.status(404).json({
// 	  message: 'Contact not found'
//   });
//   return;
//  }
//   // Відповідь, якщо контакт знайдено
//  res.status(200).json({
//   data: contact,
//  });
// });

// export default router;

// src/router/students.js

import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(createContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
router.put('/contacts/:contactId', ctrlWrapper(upsertContactController));
router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));


export default router;

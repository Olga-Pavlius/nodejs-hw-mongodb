import express from 'express';
import { getContacts, getContact } from '../controllers/contacts.controller.js';

const router = express.Router();

router.get('/contacts', getContacts);
router.get('/contacts/:contactId', getContact);

export default router;


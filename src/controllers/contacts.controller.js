import createHttpError from 'http-errors';

import {
  getContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  replaceContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

async function getContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    ownerId: req.user.id,
  });

  res.json({ data: contacts });
}

async function getContactByIdController(req, res) {
  const contactId = req.params.id;

  const contact = await getContactById(contactId);

  if (contact === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  if (contact.ownerId.toString() !== req.user.id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.json({ data: contact });
}

async function deleteContactController(req, res) {
  const contactId = req.params.id;

  const result = await deleteContact(contactId);

  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(204).end();
}

async function createContactController(req, res) {
  const contact = await createContact({ ...req.body, ownerId: req.user.id });

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: contact,
  });
}

async function updateContactController(req, res) {
  const contactId = req.params.id;

  const result = await updateContact(contactId, req.body);

  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.json({
    status: 200,
    message: 'Contact updated successfully',
    data: result,
  });
}

async function replaceContactController(req, res) {
  const contactId = req.params.id;

  const { value, updatedExisting } = await replaceContact(contactId, req.body);

  if (updatedExisting === true) {
    return res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: value,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: value,
  });
}

export {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
  replaceContactController,
};
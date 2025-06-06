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
import { refreshSession } from '../services/auth.service.js';

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
    userId: req.user.id,
  });

  res.status(200).json({
    status: 200,
    message: 'Contacts retrieved successfully',
    data: contacts,
  });
}

async function getContactByIdController(req, res) {
  const contactId = req.params.id;

  const contact = await getContactById(contactId, req.user.id);

  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Contact retrieved successfully',
    data: contact,
  });
}

async function deleteContactController(req, res) {
  const contactId = req.params.id;

  const result = await deleteContact(contactId, req.user.id);

  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(204).end();
}

async function createContactController(req, res, next) {
  try {
    const contact = await createContact({ ...req.body, userId: req.user.id });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Create contact error:', error);
    next(error);
  }
}

async function updateContactController(req, res) {
  const contactId = req.params.id;

  const updated = await updateContact(contactId, req.body, req.user.id);

  if (!updated) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Contact updated successfully',
    data: updated,
  });
}

export const replaceContactController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedContact = await replaceContact(id, {
      ...req.body,
      userId: req.user.id,
    });

    if (!updatedContact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Contact replaced successfully',
      data: updatedContact,
    });
  } catch (error) {
    console.error('Replace contact error:', error);
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    console.log('🔁 Cookies:', req.cookies);

    const oldRefreshToken = req.cookies.refreshToken;
    const sessionId = req.cookies.sessionId;

    const { accessToken, refreshToken, session } = await refreshSession(oldRefreshToken, sessionId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (err) {
    console.error('🔴 Refresh error:', err);
    next(err);
  }
};

export {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
};

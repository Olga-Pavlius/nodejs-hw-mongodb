import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  replaceContact,
  upsertContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

async function getContactsController(req, res, next) {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const {
      data,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    } = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        contacts: data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getContactByIdController(req, res, next) {
  try {
    const userId = req.user._id;
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.json({
      status: 200,
      message: 'Contact retrieved successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const result = await deleteContact(contactId, userId);

    if (!result) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function createContactController(req, res, next) {
  try {
    const userId = req.user._id;
    const newContact = await createContact({ ...req.body, userId });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

async function updateContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updatedContact = await updateContact(contactId, req.body, userId);

    if (!updatedContact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}

async function replaceContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const { contact, isNew } = await replaceContact(contactId, req.body, userId);

    if (isNew) {
      return res.status(201).json({
        status: 201,
        message: 'Contact created successfully',
        data: contact,
      });
    }

    res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

async function patchContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updatedContact = await updateContact(contactId, req.body, userId);

    if (!updatedContact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.json({
      status: 'success',
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}

async function upsertContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const { contact, isNew } = await upsertContact(contactId, req.body, userId);

    res.status(isNew ? 201 : 200).json({
      status: isNew ? 201 : 200,
      message: 'Successfully upserted a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
  replaceContactController,
  patchContactController,
  upsertContactController,
};

import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  replaceContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

async function getContactsController(req, res, next) {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

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
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: data,
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
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw new createHttpError.NotFound('Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Contact fetched successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const result = await deleteContact(contactId);

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
    const newContact = await createContact(req.body);

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
    const contactId = req.params.contactId;
    const result = await updateContact(contactId, req.body);

    if (!result) {
      throw new createHttpError.NotFound('Contact not found');
    }
     res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function replaceContactController(req, res, next) {
  try {
    const contactId = req.params.contactId;
    const { contact, isNew } = await replaceContact(contactId, req.body);

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
};

async function patchContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);

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


async function upsertContactController(req, res, next) {
  try {
    const { contactId } = req.params;

    const result = await updateContact(contactId, req.body, {
      upsert: true,
    });

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: 'Successfully upserted a contact!',
      data: result.contact,
    });
  } catch (error) {
    next(error);
  }
};


export {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  updateContactController,
  replaceContactController,
  patchContactController,
  upsertContactController
};


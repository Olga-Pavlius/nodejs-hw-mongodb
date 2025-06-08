import createHttpError from 'http-errors';
import * as fs from 'node:fs/promises';

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
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

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
    let photo = null;

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path).catch(() => {});
        photo = result.secure_url;
      } catch {
        await fs.unlink(req.file.path).catch(() => {});
        throw new createHttpError.InternalServerError('Failed to upload photo to Cloudinary');
      }
    }

    const contact = await createContact({
      ...req.body,
      userId: req.user.id,
      photo,
    });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    console.error('🔴 Create contact error:', error);
    next(error);
  }
}

async function updateContactController(req, res, next) {
  try {
    const contactId = req.params.id;
    let photo = req.body.photo;

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path).catch(() => {});
        photo = result.secure_url;
      } catch {
        await fs.unlink(req.file.path).catch(() => {});
        throw new createHttpError.InternalServerError('Failed to upload photo to Cloudinary');
      }
    }

    const updated = await updateContact(contactId, { ...req.body, photo }, req.user.id);

    if (!updated) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('🔴 Update contact error:', error);
    next(error);
  }
}

async function replaceContactController(req, res, next) {
  try {
    const { id } = req.params;
    let photo = req.body.photo;

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path).catch(() => {});
        photo = result.secure_url;
      } catch {
        await fs.unlink(req.file.path).catch(() => {});
        throw new createHttpError.InternalServerError('Failed to upload photo to Cloudinary');
      }
    }

    const updatedContact = await replaceContact(id, {
      ...req.body,
      userId: req.user.id,
      photo,
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
    console.error('🔴 Replace contact error:', error);
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
};

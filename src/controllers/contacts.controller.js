// import { Contact } from '../models/contact.model.js';

// export const getContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find();
//     res.json(contacts);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
//   }
// };

// export const getContact = async (req, res) => {
//   try {
//     const contact = await Contact.findById(req.params.contactId);
//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }
//     res.json(contact);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch contact', error: error.message });
//   }
// };



// import { getAllContacts, getContactById } from '../services/contacts.js';

// export const getStudentsController = async (req, res) => {
//  const students = await getAllContacts();

//  res.json({
//   status: 200,
//   message: 'Successfully found contacts!',
//   data: students,
//  });
// };

// export const getContactByIdController = async (req, res) => {
//  const { contactId } = req.params;
//  const contact = await getContactById(contactId);

//  // Відповідь, якщо контакт не знайдено
//  if (!contact) {
//   res.status(404).json({
//   message: 'Contacr not found'
//   });
//   return;
//  }

//   // Відповідь, якщо контакт знайдено
//  res.json({
//   status: 200,
//   message: `Successfully found contact with id ${contactId}!`,
//   data: contact,
//  });
// };


import createHttpError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { deleteContact } from "../services/contacts.js";
import { updateContact } from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      message: 'Successfully fetched contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
};

export const getContactByIdController = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, 'Student not found');
    }
    

    res.status(200).json({
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact', error: error.message });
  }
};

export const createContactController = async (req, res) => {
  // Тіло функції
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
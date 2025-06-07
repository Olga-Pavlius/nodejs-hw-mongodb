import { Contact } from '../models/contact.model.js';
import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId, 
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({ userId: userId });

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactsQuery.clone().countDocuments(),
    contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }),
  ]);

  const totalPages = Math.ceil(contactsCount / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  console.log('Found contacts:', contacts);

  return {
    data: contacts,
    total: contactsCount,
    page,
    perPage,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
   console.log('Saving contact:', payload); 
  return await Contact.create(payload);
};

export const updateContact = async (contactId, payload, userId, options = {}) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, ...options }
  );
  return result;
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};

export const replaceContact = async (contactId, data) => {
  return Contact.findOneAndReplace(
    { _id: contactId, userId: data.userId },
    data,
    { new: true, runValidators: true }
  );
};

export async function upsertContact(contactId, data, userId) {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { upsert: true, new: true }
  );
};
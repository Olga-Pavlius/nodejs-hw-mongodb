import { Contact } from '../models/contact.model.js';

export async function getAllContacts({ page, perPage, sortBy, sortOrder, filter, userId }) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = Contact.find({ userId });

  if (typeof filter.gender !== 'undefined') {
    contactQuery.where('gender').equals(filter.gender);
  }
  if (typeof filter.minYear !== 'undefined') {
    contactQuery.where('year').gte(filter.minYear);
  }
  if (typeof filter.maxYear !== 'undefined') {
    contactQuery.where('year').lte(filter.maxYear);
  }

  const [totalItems, data] = await Promise.all([
    Contact.countDocuments(contactQuery.getFilter()),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    totalItems,
    page,
    perPage,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function getContactById(contactId, userId) {
  return Contact.findOne({ _id: contactId, userId });
}

export function deleteContact(contactId, userId) {
  return Contact.findOneAndDelete({ _id: contactId, userId });
}

export function createContact(payload) {
  return Contact.create(payload);
}

export function updateContact(contactId, payload, userId, options = {}) {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, ...options }
  );
}

export async function replaceContact(contactId, payload, userId) {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, upsert: true, rawResult: true }
  );

  return {
    contact: result.value,
    isNew: !!result.lastErrorObject?.upserted,
  };
}

export async function upsertContact(contactId, payload, userId) {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, upsert: true, setDefaultsOnInsert: true, rawResult: true }
  );

  return {
    contact: result.value,
    isNew: !!result.lastErrorObject?.upserted,
  };
}

import { Contact } from '../models/contact.model.js';

export async function getAllContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = Contact.find();

  if (typeof filter.gender !== 'undefined') {
    contactQuery.where('gender').equals(filter.gender);
  }

  if (typeof filter.minYear !== 'undefined') {
    contactQuery.where('year').gte(filter.minYear);
  }

  if (typeof filter.maxYear !== 'undefined') {
    contactQuery.where('year').lte(filter.maxYear);
  }

  const [total, contacts] = await Promise.all([
    Contact.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    contacts,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
}

export function getContactById(contactId) {
  return Contact.findById(contactId);
}

export function deleteContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

export function createContact(payload) {
  return Contact.create(payload);
}

export function updateContact(contactId, payload) {
  return Contact.findByIdAndUpdate(contactId, payload, { new: true });
}

export async function replaceContact(contactId, contact) {
  const result = await Contact.findByIdAndUpdate(contactId, contact, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  return {
    contact: result?.value || result,
    isNew: Boolean(result?.lastErrorObject?.upserted),
  };
}

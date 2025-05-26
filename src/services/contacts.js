import { Contact } from '../models/contact.model.js';

export async function getAllContacts({ page, perPage, sortBy, sortOrder, filter }) {
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

  const [totalItems, data] = await Promise.all([
    Contact.countDocuments(contactQuery.getFilter()), // важливо — рахувати за тим самим фільтром
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

export async function replaceContact(contactId, payload) {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, upsert: true, rawResult: true }
  );

  return {
    contact: result.value,
    isNew: !!result.lastErrorObject?.upserted,
  };
}

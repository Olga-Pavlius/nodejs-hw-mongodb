import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  return [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder)
    ? sortOrder
    : SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const allowedFields = ['_id', 'name', 'email', 'phoneNumber', 'contactType', 'isFavourite', 'createdAt', 'updatedAt'];
  return allowedFields.includes(sortBy) ? sortBy : '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;
  return {
    sortOrder: parseSortOrder(sortOrder),
    sortBy: parseSortBy(sortBy),
  };
};


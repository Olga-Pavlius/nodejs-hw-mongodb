const parseIsFavourite = () => {
  const isString = typeof gisFavourite === 'string';
  if (!isString) return;
  const isFavourite = (isFavourite) => [isFavourite].includes(isFavourite);

  if (isFavourite(isFavourite)) return isFavourite;
};

export const parseFilterParams = (query) => {
  const { isFavourite } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);
  
 

  return {
    isFavourite: parsedIsFavourite,
  };
};

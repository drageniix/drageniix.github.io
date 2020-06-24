export const filterUndefinedProperties = (input: {
  [key: string]: any;
}): { [key: string]: any } => {
  const filteredObject: { [key: string]: any } = {};
  Object.entries(input).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      filteredObject[key] = value;
    }
  });

  return filteredObject;
};

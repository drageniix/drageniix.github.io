import { firebaseStorageTypes } from "../middleware/firebase";

export const filterUndefinedProperties = (
  input: firebaseStorageTypes
): firebaseStorageTypes => {
  const filteredObject: firebaseStorageTypes = {};
  Object.entries(input).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      filteredObject[key] = value;
    }
  });

  return filteredObject;
};

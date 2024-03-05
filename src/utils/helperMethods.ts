import { validFileExtensions } from '@/utils/constants';

export const isValidFileType = (fileName: string, fileType?: keyof validFileExtensionsType): boolean => {
  if (!fileName) {
    return false;
  }
  if (!fileType) {
    return Object.values(validFileExtensions).some((ext) => ext.indexOf(fileName.split('.').pop() || '') > -1);
  }
  return validFileExtensions[fileType].indexOf(fileName.split('.').pop() || '') > -1;
};

export const jsonStringToArrayOfObjects = (jsonString: string) => {
  try {
    // Parse the JSON string into a JavaScript object
    const obj = JSON.parse(jsonString);

    // Convert the object into an array of key-value pairs
    const keyValueArray = Object.entries(obj);

    return keyValueArray;
  } catch (error: any) {
    console.error('Error parsing JSON string:', error.message);
    return null;
  }
};

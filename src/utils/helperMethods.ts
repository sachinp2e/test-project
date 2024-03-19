import { validFileExtensions } from '@/utils/constants';

export const isValidFileType = (
  fileName: string,
  fileType?: keyof validFileExtensionsType,
  value?: any,
): boolean => {
  if (!fileName) {
    return false;
  }
  if (!fileType) {
    return Object.values(validFileExtensions).some(
      (ext: any) => ext.indexOf(fileName.split('.').pop() || '') > -1,
    );
  }
  if (value?.type) {
    const extension = value?.name.split('.').pop();
    const file = value?.type.split('/')[0];
    if(validFileExtensions.hasOwnProperty(file)){
      return validFileExtensions[file].indexOf(extension) > -1;
    }else{
      return false
    }
   
  } else if (value?.name && !value?.type) {
    const extension = value?.name.split('.').pop();
    return extension === 'glb';
  }
  const allValues = Object.values(validFileExtensions);
  const allExtensionsArray: string[] = Array.from(new Set(allValues.flat()));

  return allExtensionsArray.indexOf(fileName.split('.').pop() || '') > -1;
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

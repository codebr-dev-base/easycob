import string from '@adonisjs/core/helpers/string';

export function serializeKeysCamelCase(data: any[] | { meta: any, data: any[]; } | any) {

  const serializeObject = (obj: any) => {
    const serialized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = string.camelCase(key);
        (serialized as any)[camelKey] = obj[key];
      }
    }
    return serialized;
  };


  if (Array.isArray(data)) {
    return data.map(serializeObject);
  }
  if (data.meta && data.data) {
    const paginator = data;
    const serializedData = paginator.data.map(serializeObject);
    return {
      ...paginator,
      data: serializedData,
    };
  }
  return serializeObject(data);

}

export function serializeKeysSnakeCase(data: any[] | { meta: any, data: any[]; } | any) {

  const serializeObject = (obj: any) => {
    const serialized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = string.snakeCase(key);
        (serialized as any)[camelKey] = obj[key];
      }
    }
    return serialized;
  };


  if (Array.isArray(data)) {
    return data.map(serializeObject);
  }
  if (data.meta && data.data) {
    const paginator = data;
    const serializedData = paginator.data.map(serializeObject);
    return {
      ...paginator,
      data: serializedData,
    };
  }
  return serializeObject(data);

};
import string from '@adonisjs/core/helpers/string';

export function serializeKeysCamelCase(
  data: unknown[] | { meta: unknown; data: unknown[] } | unknown
) {
  const serializeObject = (obj: Record<string, unknown>) => {
    const serialized: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = string.camelCase(key);
        serialized[camelKey] = obj[key];
      }
    }
    return serialized;
  };

  if (Array.isArray(data)) {
    return data.map(serializeObject);
  }
  if (
    typeof data === 'object' &&
    data !== null &&
    'meta' in data &&
    'data' in data
  ) {
    const paginator = data as { meta: unknown; data: unknown[] };
    const serializedData = (paginator.data as Record<string, unknown>[]).map(
      serializeObject
    );
    return {
      ...paginator,
      data: serializedData,
    };
  }
  if (typeof data === 'object' && data !== null) {
    return serializeObject(data as Record<string, unknown>);
  }
  return data;
}

export function serializeKeysSnakeCase(
  data: unknown[] | { meta: unknown; data: unknown[] } | unknown
) {
  const serializeObject = (obj: Record<string, unknown>) => {
    const serialized: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = string.snakeCase(key);
        serialized[camelKey as keyof typeof serialized] = obj[key];
      }
    }
    return serialized;
  };

  if (Array.isArray(data)) {
    return data.map(serializeObject);
  }
  if (
    typeof data === 'object' &&
    data !== null &&
    'meta' in data &&
    'data' in data
  ) {
    const paginator = data as { meta: unknown; data: unknown[] };
    const serializedData = (paginator.data as Record<string, unknown>[]).map(
      serializeObject
    );
    return {
      ...paginator,
      data: serializedData,
    };
  }
  if (typeof data === 'object' && data !== null) {
    return serializeObject(data as Record<string, unknown>);
  }
  return data;
}

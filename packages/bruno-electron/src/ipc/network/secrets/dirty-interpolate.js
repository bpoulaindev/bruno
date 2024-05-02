// TODO: remove this function from here and use the one from @usebruno/common

const flattenObject = (obj, parentKey = '') => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = parentKey ? (Array.isArray(obj) ? `${parentKey}[${key}]` : `${parentKey}.${key}`) : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {});
};

const interpolate = (str, obj, injection) => {
  if (!str || typeof str !== 'string' || !obj || typeof obj !== 'object') {
    return str;
  }
  const patternRegex = /\{\{([^}]+)\}\}/g;
  const flattenedObj = flattenObject(obj);
  const result = str.replace(patternRegex, (match, placeholder) => {
    const replacement = injection?.(match) || flattenedObj[placeholder];
    return replacement !== undefined ? replacement : match;
  });

  return result;
};

module.exports = {
  interpolate
};

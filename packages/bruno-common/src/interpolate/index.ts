/**
 * The interpolation function expects a string with placeholders and an object with the values to replace the placeholders.
 * The keys passed can have dot notation too.
 *
 * Ex: interpolate('Hello, my name is ${user.name} and I am ${user.age} years old', {
 *  "user.name": "Bruno",
 *  "user": {
 *   "age": 4
 *  }
 * });
 * Output: Hello, my name is Bruno and I am 4 years old
 */

import { flattenObject } from '../utils';

const interpolate = (str: string, obj: Record<string, any>, injection?: (match: string) => string | null): string => {
  if (!str || typeof str !== 'string' || !obj || typeof obj !== 'object') {
    return str;
  }
  console.log('will this somehow even log ?');
  const patternRegex = /\{\{([^}]+)\}\}/g;
  const flattenedObj = flattenObject(obj);
  const result = str.replace(patternRegex, (match, placeholder) => {
    // if the match contains "secret:" then it should be a call to a secret provider
    /* if (match.startsWith('secret:')) {
      // 0 useless, 1 is the instance name, 2 is the key
      const params = placeholder.split(':');
      // secretsFetcher(params[1], params[2]);
    } */
    const replacement = injection?.(match) || flattenedObj[placeholder];
    return replacement !== undefined ? replacement : match;
  });

  return result;
};

export default interpolate;

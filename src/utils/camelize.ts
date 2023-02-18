/* eslint-disable @typescript-eslint/ban-ts-comment */
import { camelCase, isArray, isObject, snakeCase, transform } from 'lodash';
// @ts-ignore
export const camelize = (obj): Record<unknown, unknown> | unknown[] =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key.toString());
    acc[camelKey] = isObject(value) ? camelize(value) : value;
  });
// @ts-ignore
export const snakeize = (obj): Record<unknown, unknown> | unknown[] =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : snakeCase(key.toString());
    acc[camelKey] = isObject(value) ? snakeize(value) : value;
  });

import * as core from './core';
import { withIterable } from './iterable';
import chain from './chain';

/**
 * forEach() calls a provided callback function once for each element in an iterable in ascending order.
 * @param {Iterable} iterable An iterable (array, Map, Set)
 * @param {Function} callback Function to execute on each element.
 * @returns {Iterable} The collection as passed in.
 */
export const forEach = withIterable(core.forEach);
export const map = withIterable(core.map);
export const filter = withIterable(core.filter);
export const sort = withIterable(core.sort);
export const take = withIterable(core.take);
export const takeWhile = withIterable(core.takeWhile);
export const skip = withIterable(core.skip);
export const skipWhile = withIterable(core.skipWhile);
export const find = core.find;
export const reduce = core.reduce;
export const join = core.join;
export const every = core.every;
export const some = core.some;
export const nth = core.nth;
export const first = core.first;
export const last = core.last;
export * from './chain';

const simpleString = 'The quick brown fox jumped over the lazy dog.';
const intArray = [1, 2, 3];
const simpleTypedArray = new Uint8Array([0x00, 0xff]);
const simpleMap = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);

/* eslint-disable no-console */
{
  let result1 = chain(intArray)
    .filter(el => el === 3)
    .value();
  console.log('Result 1: ', result1);

  let result2 = chain(intArray)
    .map(el => el * 2)
    .filter(el => el > 3)
    .reduce((acc, el) => acc + el, 0);
  console.log('Result 2: ', result2);

  let result3 = chain(simpleString)
    .filter(el => el !== 'x')
    .value();
  console.log('Result 3: ', result3);

  let result4 = chain(simpleMap)
    .filter(el => el[0] === 'a')
    .map(el => [el[0], 'yeesh'])
    .value();
  console.log('Result 4: ', result4);

  let result5 = chain(simpleString)
    .sort()
    .value();
  console.log('Result 5: ', result5);
}

{
  let result1 = filter(simpleTypedArray, el => el === 0x00);
  console.log('Result 1: ', result1, result1 instanceof Uint8Array);
}

import * as core from "./core";

/**
 * forEach() calls a provided callback function once for each element in an iterable in ascending order.
 * @param {Iterable} iterable An iterable (array, Map, Set)
 * @param {Function} callback Function to execute on each element.
 * @returns {Iterable} The collection as passed in.
 */
export const forEach = withIterable(core.forEach);
export const map = withIterable(core.map);
export const select = map;
export const filter = withIterable(core.filter);
export const where = filter;
export const find = core.find;
export const first = find;
export const reduce = core.reduce;

function withIterable(generator) {
  return function(iterable, callback = core.defaultCallback) {
    if (!iterable || !iterable[Symbol.iterator]) {
      iterable = Array.from(iterable);
    }
    const results = generator(iterable, callback);
    const type = getType(iterable);
    return reconstitute(results, type);
  };
}

function getType(input) {
  if (typeof input === "string") {
    return String;
  }
  switch (input) {
    case input instanceof Map:
      return Map;
    case input instanceof WeakMap:
      return WeakMap;
    case input instanceof Set:
      return Set;
    case input instanceof WeakSet:
      return WeakSet;
    case input instanceof Promise:
      return Promise;
    case input instanceof Int8Array:
      return Int8Array;
    case input instanceof Uint8Array:
      return Uint8Array;
    case input instanceof Int16Array:
      return Int16Array;
    case input instanceof Uint16Array:
      return Uint16Array;
    case input instanceof Int32Array:
      return Int32Array;
    case input instanceof Uint32Array:
      return Uint32Array;
  }
}

function reconstitute(iterable, type) {
  if (type === String) {
    return Array.from(iterable).join("");
  } else if (type) {
    return new type(iterable);
  }
  return Array.from(iterable);
}

function chain(iterable, type) {
  if (!iterable || !iterable[Symbol.iterator]) {
    iterable = Array.from(iterable);
  }

  if (!type) {
    type = getType(iterable);
  }

  return Object.create({
    forEach: callback => chain(core.forEach(iterable, callback), type),
    map: callback => chain(core.map(iterable, callback), type),
    filter: callback => chain(core.filter(iterable, callback), type),
    find: callback => core.find(iterable, callback),
    reduce: (callback, initialValue) =>
      core.reduce(iterable, callback, initialValue),
    sort: compare => chain(core.sort(iterable, compare), type),
    value: () => reconstitute(iterable, type)
  });
}

class Chain {
  constructor(input, type) {
    if (!input || !input[Symbol.iterator]) {
      input = Array.from(input);
    }
    if (!type) {
      if (typeof input === "string") {
        type = String;
      } else if (input instanceof Map) {
        type = Map;
      } else if (input instanceof Set) {
        type = Set;
      }
    }
    this.type = type;
    this.collection = input;
  }

  forEach(callback) {
    return forEach(this.collection, callback);
  }

  map(callback) {
    if (typeof callback !== "function") {
      return this;
    }
    return new Chain(core.map(this.collection, callback), this.type);
  }

  filter(predicate) {
    if (typeof predicate !== "function") {
      return this;
    }
    return new Chain(core.filter(this.collection, predicate), this.type);
  }

  find(predicate) {
    if (typeof predicate !== "function") {
      return this;
    }
    for (const element of this.collection) {
      if (predicate(element)) {
        return element;
      }
    }
  }

  reduce(callback, initialValue) {
    if (typeof callback !== "function") {
      return this;
    }
    let accumulator = initialValue;
    for (const element of this.collection) {
      accumulator = callback(accumulator, element);
    }
    return accumulator;
  }

  join(seperator) {}

  every(predicate) {}
  some(predicate) {}

  flat() {}
  flatMap() {}
  includes(value) {
    const el = this.find(el => Object.is(el, value));
    return !Object.is(undefined);
  }
  keys() {}
  reduceRight() {}

  take(number) {}
  takeWhile(number) {}
  skip(number) {}
  skipWhile(number) {}

  nth() {}
  first() {}
  last() {}
  head() {}
  tail() {}

  sort(compare) {
    const copy = Array.from(this.collection);
    copy.sort(compare);
    return new Chain(copy, this.type);
  }

  sortBy(predicate) {}

  value() {
    if (this.type === String) {
      return Array.from(this.collection).join("");
    } else if (this.type) {
      return new this.type(this.collection);
    }
    return Array.from(this.collection);
  }

  *[Symbol.iterator]() {
    yield* this.collection;
  }
}

// function chain(input) {
//   return new Chain(input);
// }

const simpleString = "The quick brown fox jumped over the lazy dog.";
const intArray = [1, 2, 3];
const simpleTypedArray = new Uint8Array([0x00, 0xff]);
const simpleMap = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3]
]);
const simpleSet = new Set([1, 2, 3]);

{
  let result1 = chain(intArray)
    .filter(el => el === 3)
    .value();
  console.log("Result 1: ", result1);

  let result2 = chain(intArray)
    .map(el => el * 2)
    .filter(el => el > 3)
    .reduce((acc, el) => acc + el, 0);
  console.log("Result 2: ", result2);

  let result3 = chain(simpleString)
    .filter(el => el !== "x")
    .value();
  console.log("Result 3: ", result3);

  let result4 = chain(simpleMap)
    .filter(el => el[0] === "a")
    .map(el => [el[0], "yeesh"])
    .value();
  console.log("Result 4: ", result4);

  let result5 = chain(simpleString)
    .sort()
    .value();
  console.log("Result 5: ", result5);
}

{
  let result1 = filter(simpleTypedArray, el => el === 0x00);
  console.log("Result 1: ", result1, result1 instanceof Uint8Array);
}

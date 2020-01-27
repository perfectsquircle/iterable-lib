import * as core from "./core";
import { getType, normalize, materialize } from "./iterable";

export default function chain(iterable, type) {
  return new Chain(iterable, type);
}

class Chain {
  constructor(iterable, type) {
    this.iterable = normalize(iterable);

    if (!type) {
      type = getType(iterable);
    }
    this.type = type;
  }
  
  forEach(callback) {
    return chain(core.forEach(this.iterable, callback), this.type);
  }
  map(callback) {
    return chain(core.map(this.iterable, callback), this.type);
  }
  filter(callback) {
    return chain(core.filter(this.iterable, callback), this.type);
  }
  sort(compare) {
    return chain(core.sort(this.iterable, compare), this.type);
  }

  find(callback) {
    return core.find(this.iterable, callback);
  }
  reduce(callback, initialValue) {
    return core.reduce(this.iterable, callback, initialValue);
  }
  join(separator) {
    return core.join(this.iterable, separator);
  }
  every(predicate) {
    return core.every(this.iterable, predicate);
  }
  some(predicate) {
    return core.some(this.iterable, predicate);
  }

  value() {
    return materialize(this.iterable, this.type);
  }

  [Symbol.iterator]: function*() {
    yield* this.collection;
  }
};

/*
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

  sortBy(predicate) {}

  */

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
  take(count) {
    return chain(core.take(this.iterable, count), this.type);
  }
  takeWhile(predicate) {
    return chain(core.take(this.iterable, predicate), this.type);
  }
  skip(count) {
    return core.skip(this.iterable, count);
  }
  skipWhile(count) {
    return core.skipWhile(this.iterable, count);
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

  *[Symbol.iterator]() {
    yield* this.iterable;
  }
}

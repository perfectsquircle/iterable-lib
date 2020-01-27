export const defaultCallback = x => x;

export function* forEach(iterable, callback = defaultCallback) {
  for (const element of iterable) {
    callback(element);
    yield element;
  }
}

export function* map(iterable, callback = defaultCallback) {
  for (const element of iterable) {
    yield callback(element);
  }
}

export function* filter(iterable, predicate = defaultCallback) {
  for (const element of iterable) {
    if (predicate(element)) {
      yield element;
    }
  }
}

export function find(iterable, predicate = defaultCallback) {
  for (const element of iterable) {
    if (predicate(element)) {
      return element;
    }
  }
}

export function reduce(iterable, callback = defaultCallback, initialValue) {
  let accumulator = initialValue;
  for (const element of iterable) {
    accumulator = callback(accumulator, element);
  }
  return accumulator;
}

export function sort(iterable, compare) {
  const copy = Array.from(iterable);
  copy.sort(compare);
  return copy;
}

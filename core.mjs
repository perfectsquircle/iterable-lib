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

export function sort(iterable, compare) {
  const copy = Array.from(iterable);
  copy.sort(compare);
  return copy;
}

export function* take(iterable, count) {
  if (count <= 0) {
    return;
  }
  let i = 0;
  for (const element of iterable) {
    if (i++ < count) {
      yield element;
    }
  }
}

export function skip(iterable, count) {
  if (count <= 0) {
    return;
  }
  let i = 0;
  // eslint-disable-next-line no-unused-vars
  for (const element of iterable) {
    if (i++ >= count) {
      return;
    }
  }
}

export function* takeWhile(iterable, predicate) {
  for (const element of iterable) {
    const take = predicate(element);
    if (!take) {
      break;
    }
    yield element;
  }
}

export function skipWhile(iterable, predicate) {
  for (const element of iterable) {
    const skip = predicate(element);
    if (!skip) {
      break;
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

export function join(iterable, separator) {
  return reduce(iterable, (acc, el) => acc + separator + el, '').trimRight(
    separator
  );
}

export function every(iterable, predicate) {
  return reduce(iterable, (acc, el) => acc && predicate(el), false);
}

export function some(iterable, predicate) {
  return reduce(iterable, (acc, el) => acc || predicate(el), false);
}

export function nth(iterable, n) {
  skip(iterable, n - 1);
  return iterable.next().value;
}

export function first(iterable) {
  return iterable.next().value;
}

export function last(iterable) {
  let last;
  for (const element of iterable) {
    last = element;
  }
  return last;
}

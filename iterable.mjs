export function withIterable(generator) {
  return function(iterable, callback = core.defaultCallback) {
    iterable = normalize(iterable);
    const results = generator(iterable, callback);
    const type = getType(iterable);
    return materialize(results, type);
  };
}

export function normalize(iterable) {
  if (!iterable || !iterable[Symbol.iterator]) {
    iterable = Array.from(iterable);
  }
  return iterable;
}

export function getType(input) {
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

export function materialize(iterable, type) {
  if (type === String) {
    return Array.from(iterable).join("");
  } else if (type) {
    return new type(iterable);
  }
  return Array.from(iterable);
}

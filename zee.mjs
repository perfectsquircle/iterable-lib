const defaultCallback = (x) => x;

/**
 * forEach() calls a provided callback function once for each element in an iterable in ascending order.
 * @param {Iterable} collection An iterable (array, Map, Set)
 * @param {Function} callback Function to execute on each element. 
 */
export function forEach(collection, callback = defaultCallback) {
    let i = 0;
    for (const element of collection) {
        callback(element, i++, collection);
    }
    return collection;
}

export function map(collection, callback = defaultCallback) {
    collection = validate(collection);
    const results = collect(collection, callback);
    const type = getType(collection);
    return reconstitute(results, type);
}

function* collect(collection, callback) {
    for (const element of collection) {
        yield callback(element);
    }
}

function getType(input) {
    if (typeof (input) === 'string') {
        return String;
    }
    switch (input) {
        case input instanceof Map:
            return Map;
        case input instanceof WeakMap:
            return Map;
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
    return type;
}

function validate(input) {
    if (!input || !input[Symbol.iterator]) {
        input = Array.from(input);
    }
    return input;
}

class Chain {
    constructor(input, type) {
        if (!input || !input[Symbol.iterator]) {
            input = Array.from(input);
        }
        if (!type) {
            if (typeof (input) === 'string') {
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

    forEach = forEach.bind(this);

    map(callback) {
        if (typeof (callback) !== "function") {
            return this;
        }
        return new Chain(mapYield(this.collection, callback), this.type);
    }

    filter(predicate) {
        if (typeof (predicate) !== "function") {
            return this;
        }
        return new Chain(filterYield(this.collection, predicate), this.type);
    }

    find(predicate) {
        if (typeof (predicate) !== "function") {
            return this;
        }
        for (const element of this.collection) {
            if (predicate(element)) {
                return element;
            }
        }
    }

    reduce(callback, initialValue) {
        if (typeof (callback) !== "function") {
            return this;
        }
        let accumulator = initialValue;
        for (const element of this.collection) {
            accumulator = callback(accumulator, element);
        }
        return accumulator;
    }

    join(seperator) {

    }

    every(predicate) { }
    some(predicate) { }

    flat() { }
    flatMap() { }
    includes(value) {
        const el = this.find(el => Object.is(el, value));
        return !Object.is(undefined);
    }
    keys() { }
    reduceRight() { }

    take(number) { }
    takeWhile(number) { }
    skip(number) { }
    skipWhile(number) { }

    nth() { }
    first() { }
    last() { }
    head() { }
    tail() { }

    sort(compare) {
        const copy = Array.from(this.collection);
        copy.sort(compare);
        return new Chain(copy, this.type);
    }

    sortBy(predicate) { }

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

function* mapYield(collection, callback) {
    for (const element of collection) {
        yield callback(element);
    }
}

function* filterYield(collection, predicate) {
    for (const element of collection) {
        if (predicate(element)) {
            yield element;
        }
    }
}

function chain(input) {
    return new Chain(input);
}


const simpleString = "The quick brown fox jumped over the lazy dog.";
const intArray = [1, 2, 3];
const simpleTypedArray = new Uint8Array([0x00, 0xff]);
const simpleMap = new Map([['a', 1], ['b', 2], ['c', 3]]);
const simpleSet = new Set([1, 2, 3]);


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
    .filter(el => el[0] === 'a')
    .map(el => [el[0], 'yeesh'])
    .value();
console.log("Result 4: ", result4);

let result5 = chain(simpleString)
    .sort().value();
console.log("Result 5: ", result5);


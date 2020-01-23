class ZeeWrapper {
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

    forEach(callback) {
        if (typeof (callback) !== "function") {
            return this;
        }
        for (const element of this.collection) {
            callback.call(this, element);
        }
        return this;
    }

    map(callback) {
        if (typeof (callback) !== "function") {
            return this;
        }
        return new ZeeWrapper(mapYield(this.collection, callback), this.type);
    }

    filter(predicate) {
        if (typeof (predicate) !== "function") {
            return this;
        }
        return new ZeeWrapper(filterYield(this.collection, predicate), this.type);
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
        return new ZeeWrapper(copy, this.type);
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

function z(input) {
    return new ZeeWrapper(input);
}


const simpleString = "The quick brown fox jumped over the lazy dog.";
const intArray = [1, 2, 3];
const simpleTypedArray = new Uint8Array([0x00, 0xff]);
const simpleMap = new Map([['a', 1], ['b', 2], ['c', 3]]);
const simpleSet = new Set([1, 2, 3]);


let result1 = z(intArray)
    .filter(el => el === 3)
    .value();
console.log("Result 1: ", result1);


let result2 = z(intArray)
    .map(el => el * 2)
    .filter(el => el > 3)
    .reduce((acc, el) => acc + el, 0);
console.log("Result 2: ", result2);


let result3 = z(simpleString)
    .filter(el => el !== "x")
    .value();
console.log("Result 3: ", result3);

let result4 = z(simpleMap)
    .filter(el => el[0] === 'a')
    .map(el => [el[0], 'yeesh'])
    .value();
console.log("Result 4: ", result4);

let result5 = z(simpleString)
    .sort().value();
console.log("Result 5: ", result5);


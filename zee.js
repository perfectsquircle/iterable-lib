class zeeWrapper {
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
        return new zeeWrapper(mapYield(this.collection, callback), this.type);
    }

    filter(predicate) {
        if (typeof (predicate) !== "function") {
            return this;
        }
        return new zeeWrapper(filterYield(this.collection, predicate), this.type);
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

    every(predicate) { }
    some(predicate) { }

    flat() { }
    flatMap() { }
    includes(predicate) { }
    keys() { }
    reduceRight() { }

    take(number) { }
    skip(number) { }

    sort(compare) {
        if (!compare) {
            compare = defaultCompare
        }
    }

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

function defaultCompare(a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
}

function zee(input) {
    return new zeeWrapper(input);
}


const simpleString = "The quick brown fox jumped over the lazy dog.";
const intArray = [1, 2, 3];
const simpleTypedArray = new Uint8Array([0x00, 0xff]);
const simpleMap = new Map([['a', 1], ['b', 2], ['c', 3]]);
const simpleSet = new Set([1, 2, 3]);


let result1 = zee(intArray)
    .filter(el => el === 3)
    .value();
console.log("Result 1: ", result1);


let result2 = zee(intArray)
    .map(el => el * 2)
    .filter(el => el > 3)
    .reduce((acc, el) => acc + el, 0);
console.log("Result 2: ", result2);


let result3 = zee(simpleString)
    .filter(el => el !== "x")
    .value();
console.log("Result 3: ", result3);

let result4 = zee(simpleMap)
    .filter(el => el[0] === 'a')
    .map(el => [el[0], 'yeesh'])
    .value();
console.log("Result 4: ", result4);


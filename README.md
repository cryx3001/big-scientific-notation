## big-scientific-notation

A light library for Node.js to manipulate big numbers written in a scientific notation.
Support very basic arithmetics operations (+, -, *, /)

Install
`npm install big-scientific-notation`

- Examples:
```js
    const BSN = require("big-scientific-notation");
    let a = new BSN.BigScientificNotation(123);
    let b = new BSN.BigScientificNotation([1, 1.23, 2]); // [sign, mantissa, exponent] -> 1 * 1.23 * 10^2 = 123

    a.isEqual(b); // true
    a.isEqual(50); // false
    
    a.isGreater(b); // false
    a.isGreater(50); // true
    
    a.isLess(b); // false
    a.isLess(50); // famse
    
    a.toJSON(); // { s: 1, m: 1.23, e: 2 }
    a.toString(); // 1.23E2
    a.toString(1); // 1.2E2
    
    a.add(b); // BigScientificNotation { _numSN: { s: 1, m: 2.46, e: 2 } }
    a.add(50); // BigScientificNotation { _numSN: { s: 1, m: 1.73, e: 2 } }
    
    a.substract(b); // BigScientificNotation { _numSN: { s: 1, m: 0, e: 0 } }
    a.substract(500); // == a.add(-500) = BigScientificNotation { _numSN: { s: -1, m: 3.77, e: 2 } }
    
    a.divide(b); // BigScientificNotation { _numSN: { s: 1, m: 1, e: 0 } }
    a.divide(50); // BigScientificNotation { _numSN: { s: 1, m: 2.46, e: 0 } }
    
    a.multiply(b); // BigScientificNotation { _numSN: { s: 1, m: 1.5129, e: 4 } }
    a.multiply(50); // BigScientificNotation { _numSN: { s: 1, m: 6.15, e: 3 } }
    
    a.substract(200).abs(); //BigScientificNotation { _numSN: { s: 1, m: 7.7, e: 1 } }
    
    a.add(50).multiply(80).divide(5).toString(); // = ((123+50)*80)/5 => 2.768E3
```
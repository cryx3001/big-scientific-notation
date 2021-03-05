# big-scientific-notation

[![npm version](https://img.shields.io/npm/v/big-scientific-notation.svg)](https://www.npmjs.com/package/big-scientific-notation)
[![npm downloads](https://img.shields.io/npm/dw/big-scientific-notation)](https://www.npmjs.com/package/big-scientific-notation)
<br></br>

A light library for Node.js to manipulate big numbers written in a scientific notation.
Support basic arithmetics operations (+, -, *, /, power, abs)

Install
`npm install big-scientific-notation`

## Methods
```js
    const BSN = require("big-scientific-notation");
    let a = new BSN.BigScientificNotation(123);
    let b = new BSN.BigScientificNotation([1, 1.23, 2]); // [sign, mantissa, exponent] -> 1 * 1.23 * 10^2 = 123

    a.isEqual(b); // true
    a.isEqual(50); // false
    
    a.isGreater(b); // false
    a.isGreater(50); // true
    
    a.isLess(b); // false
    a.isLess(50); // false
    
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

    a.setSign(-1); // BigScientificNotation { _numSN: { s: -1, m: 1.23, e: 2 } }
    a.setSign(1); // BigScientificNotation { _numSN: { s: 1, m: 1.23, e: 2 } }
    
    a.setExponent(5); // BigScientificNotation { _numSN: { s: 1, m: 1.23, e: 5 } }
    a.setExponent(-2); // BigScientificNotation { _numSN: { s: 1, m: 1.23, e: -2 } }
    
    a.setMantissa(16.589); // BigScientificNotation { _numSN: { s: 1, m: 1.6589, e: 3 } }
    a.setMantissa(3.21).setExponent(3).convertToDecimal(); // 3210
    
    // For power(x), x is a number !
    new bsn.BigScientificNotation(2).power(8); // BigScientificNotation { _numSN: { s: 1, m: 2.56, e: 2 } }
    new bsn.BigScientificNotation(4).power(-3); // BigScientificNotation { _numSN: { s: 1, m: 1.5625, e: -2 } }
```

## License

ISC License

Copyright (c) 2021, Titouan Guionneau

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
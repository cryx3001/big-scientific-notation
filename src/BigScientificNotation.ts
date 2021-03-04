export class BigScientificNotation {
    private _numSN : numSN = {s: 1, m: 0, e: 0};

    constructor(x : number)
    constructor(x : Array<number>)
    constructor (x : number | Array<number>) {
        if (typeof x === "number") { this._numSN = this._convertToScientificNotation(x); }
        if (Array.isArray(x) && x.length >= 3) {
            this._numSN = {
                s: x[0],
                m: x[1],
                e: x[2]
            };
        }
    }

    private _convertToScientificNotation (x : number) : numSN {
        if (!isFinite(x)) throw new Error("Given number is too big (Infinity)");
        if (x == 0) { return { s: 0, m: 0, e: 0 }; }

        const absX = Math.abs(x);
        const numLog = Math.floor(Math.log10(absX));
        return { s: x >= 0 ? 1 : -1, m: absX / (10 ** numLog), e: numLog };
    }

    // -1: numA > numB
    // 0 : numA == numB
    // 1 : numB < numA
    private _compare (numA: numSN, numB: numSN) : number {
        if (numA.s == numB.s) {
            const mA = numA.m * numA.s;
            const mB = numB.m * numB.s;
            const expComp = this._compareExponent(numA, numB);
            if (expComp == 0) { return mA > mB ? -1 : (mA < mB ? 1 : 0); }
            return expComp * numA.s;
        }
        return numA.s > numB.s ? -1 : 1;
    }

    private _compareExponent(numA: numSN, numB: numSN): number{
        return numA.e > numB.e ? -1 : (numA.e < numB.e ? 1 : 0);
    }

    public add(numA: BigScientificNotation | number) : BigScientificNotation{
        const x = typeof numA == "number" ? this._convertToScientificNotation(numA) : numA._numSN;
        const expComp = this._compareExponent(x, this._numSN);
        let ansM : number;
        if(expComp == -1)
            ansM = x.s*x.m + this._numSN.s*this._numSN.m * 10**(this._numSN.e - x.e);
        else
            ansM = this._numSN.s*this._numSN.m + x.s*x.m * 10**(x.e - this._numSN.e);


        const numLog = Math.floor(Math.log10(Math.abs(ansM)));
        const isNumLogFinite = isFinite(numLog);
        return new BigScientificNotation([
            ansM >= 0 ? 1 : -1,
            Math.abs(ansM / (10 ** (isNumLogFinite ? numLog : 0))),
            isNumLogFinite ? (Math.max(x.e, this._numSN.e) + numLog) : 0
        ]);
    }

    public substract(numA: BigScientificNotation | number) : BigScientificNotation{
        let x;
        if(typeof numA == "number")
            x = -1 * numA;
        else
            x = new BigScientificNotation([numA._numSN.s * -1, numA._numSN.m, numA._numSN.e ]);
        return this.add(x);
    }

    public multiply(numA: BigScientificNotation | number) : BigScientificNotation{
        const x = typeof numA == "number" ? this._convertToScientificNotation(numA) : numA._numSN;
        const ansM = x.m * this._numSN.m;
        const numLog = Math.floor(Math.log10(Math.abs(ansM)));
        const isNumLogFinite = isFinite(numLog);
        return new BigScientificNotation([
            x.s * this._numSN.s,
            Math.abs(ansM / (10 ** (isNumLogFinite ? numLog : 0))),
            isNumLogFinite ? (x.e + this._numSN.e + numLog): 0
        ]);
    }

    public divide(numA: BigScientificNotation | number) : BigScientificNotation{
        const x = typeof numA == "number" ? this._convertToScientificNotation(numA) : numA._numSN;
        const ansM = this._numSN.m / x.m ;
        const numLog = Math.floor(Math.log10(Math.abs(ansM)));
        const isNumLogFinite = isFinite(numLog);
        return new BigScientificNotation([
            x.s * this._numSN.s,
            Math.abs(ansM / (10 ** (isNumLogFinite ? numLog : 0))),
            isNumLogFinite ? (this._numSN.e - x.e + numLog): 0
        ]);
    }


    public isEqual (numA: BigScientificNotation | number) : boolean {
        const x = typeof numA == "number" ? this._convertToScientificNotation(numA) : numA._numSN;
        return this._compare(this._numSN, x) === 0;
    }

    public isGreater (numA: BigScientificNotation | number) : boolean {
        const x = typeof numA == "number" ? this._convertToScientificNotation(numA) : numA._numSN;
        return this._compare(this._numSN, x) === -1;
    }

    public isLess (numA: BigScientificNotation | number) : boolean {
        const x = typeof numA == "number" ? this._convertToScientificNotation(numA) : numA._numSN;
        return this._compare(this._numSN, x) === 1;
    }

    public toString (maxDecimalDigits? : number) : string {
        const mantissa = maxDecimalDigits ? this._numSN.m.toFixed(maxDecimalDigits) : this._numSN.m;
        return `${this._numSN.s === -1 ? "-" : ""}${mantissa}E${this._numSN.e}`;
    }

    public toJSON () : numSN{
        return this._numSN;
    }
}

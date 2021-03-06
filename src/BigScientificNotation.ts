export class BigScientificNotation {
    private readonly _numSN : numSN = {s: 1, m: 0, e: 0};

    constructor(x : number)
    constructor(x : Array<number>)
    constructor (x : number | Array<number>) {
        if (typeof x === "number") { this._numSN = BigScientificNotation._convertToScientificNotation(x); }
        if (Array.isArray(x) && x.length >= 3) {
            const numLog = Math.floor(Math.log10(Math.abs(x[1])));
            const isNumLogFinite = isFinite(numLog);
            this._numSN = {
                s: x[0],
                m: Math.abs(x[1] / (10 ** (isNumLogFinite ? numLog : 0))),
                e: isNumLogFinite ? (x[2] + numLog) : 0
            };
        }
    }

    private static _convertToScientificNotation (x : number) : numSN {
        if (!isFinite(x)) throw new Error("Given number is too big (Infinity)");
        if (x == 0) { return { s: 0, m: 0, e: 0 }; }

        const absX = Math.abs(x);
        const numLog = Math.floor(Math.log10(absX));
        return { s: x >= 0 ? 1 : -1, m: absX / (10 ** numLog), e: numLog };
    }

    public convertToDecimal() : number {
        return this._numSN.s * this._numSN.m * (10** this._numSN.e);
    }

    // -1: numA > numB
    // 0 : numA == numB
    // 1 : numB < numA
    private static _compare (numA: numSN, numB: numSN) : number {
        if (numA.s == numB.s) {
            const mA = numA.m * numA.s;
            const mB = numB.m * numB.s;
            const expComp = BigScientificNotation._compareExponent(numA, numB);
            if (expComp == 0) { return mA > mB ? -1 : (mA < mB ? 1 : 0); }
            return expComp * numA.s;
        }
        return numA.s > numB.s ? -1 : 1;
    }

    private static _compareExponent(numA: numSN, numB: numSN): number{
        return numA.e > numB.e ? -1 : (numA.e < numB.e ? 1 : 0);
    }

    public getSign() : number {return this._numSN.s;}
    public getExponent() : number {return this._numSN.e;}
    public getMantissa() : number {return this._numSN.m;}

    public setSign(x : number) : BigScientificNotation {
        if(x != 1 && x != -1){
            throw new Error("Invalid arg : must be 1 or -1");
        }
        return new BigScientificNotation([x, this._numSN.m, this._numSN.e]);
    }

    public setExponent(x : number) : BigScientificNotation {
        return new BigScientificNotation([this._numSN.s, this._numSN.m, x]);
    }

    public setMantissa(x : number) : BigScientificNotation {
        const numLog = Math.floor(Math.log10(Math.abs(x)));
        const isNumLogFinite = isFinite(numLog);
        return new BigScientificNotation([
            this._numSN.s,
            Math.abs(x / (10 ** (isNumLogFinite ? numLog : 0))),
            isNumLogFinite ? (this._numSN.e + numLog) : 0]);
    }

    public add(numA: BigScientificNotation | number) : BigScientificNotation{
        const x = typeof numA == "number" ? BigScientificNotation._convertToScientificNotation(numA) : numA._numSN;
        const expComp = BigScientificNotation._compareExponent(x, this._numSN);
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
        const x = typeof numA == "number" ? BigScientificNotation._convertToScientificNotation(numA) : numA._numSN;
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
        const x = typeof numA == "number" ? BigScientificNotation._convertToScientificNotation(numA) : numA._numSN;
        const ansM = this._numSN.m / x.m ;
        const numLog = Math.floor(Math.log10(Math.abs(ansM)));
        const isNumLogFinite = isFinite(numLog);
        return new BigScientificNotation([
            x.s * this._numSN.s,
            Math.abs(ansM / (10 ** (isNumLogFinite ? numLog : 0))),
            isNumLogFinite ? (this._numSN.e - x.e + numLog): 0
        ]);
    }

    public abs() : BigScientificNotation{
        return new BigScientificNotation([
            1,
            this._numSN.m,
            this._numSN.e
        ]);
    }

    public power(numA: number) : BigScientificNotation {
        if(numA == 0) return new BigScientificNotation([1, 1, 0]);
        const signValue = numA >= 0 ? 1 : -1;
        const ans = new BigScientificNotation([
            this._numSN.s == -1 ? (Math.abs(numA) % 2 == 0 ? 1 : -1) : this._numSN.s,
            this._numSN.m,
            this._numSN.e * numA]);
        const maxExp = Math.floor(Math.log10(Number.MAX_VALUE));
        const appliedExp = signValue * (maxExp - 50); // Well, I guess it will works
        for(let k = Math.abs(numA); k > 0; k -= maxExp - 50){
            const valueToMultiply = signValue == 1 ? Math.min(appliedExp, k * signValue) : Math.max(appliedExp, k * signValue);
            const ansM = ans._numSN.m ** valueToMultiply;
            const numLog = Math.floor(Math.log10(Math.abs(ansM)));
            const isNumLogFinite = isFinite(numLog);
            ans._numSN.m = Math.abs(ansM / (10 ** (isNumLogFinite ? numLog : 0)));
            ans._numSN.e = isNumLogFinite ? (ans._numSN.e + numLog): 0;
        }
        return ans;
    }

    public isEqual (numA: BigScientificNotation | number) : boolean {
        const x = typeof numA == "number" ? BigScientificNotation._convertToScientificNotation(numA) : numA._numSN;
        return BigScientificNotation._compare(this._numSN, x) === 0;
    }

    public isGreater (numA: BigScientificNotation | number) : boolean {
        const x = typeof numA == "number" ? BigScientificNotation._convertToScientificNotation(numA) : numA._numSN;
        return BigScientificNotation._compare(this._numSN, x) === -1;
    }

    public isLess (numA: BigScientificNotation | number) : boolean {
        const x = typeof numA == "number" ? BigScientificNotation._convertToScientificNotation(numA) : numA._numSN;
        return BigScientificNotation._compare(this._numSN, x) === 1;
    }

    public toString (maxDecimalDigits? : number) : string {
        const mantissa = maxDecimalDigits ? this._numSN.m.toFixed(maxDecimalDigits) : this._numSN.m;
        return `${this._numSN.s === -1 ? "-" : ""}${mantissa}E${this._numSN.e}`;
    }

    public toJSON () : numSN{
        return this._numSN;
    }
}

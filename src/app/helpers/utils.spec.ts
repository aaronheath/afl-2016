import {loopObj} from './utils';

describe('Utils.loopObj', function() {
    beforeEach(() => {
        this.obj = {
            a: 1,
            b: 2,
            c: 3,
        };

        this.useKey = 'b';

        this.newValue = 4;

        this.expected = {
            a: 1,
            [this.useKey]: this.newValue,
            c: 3,
        };
    });

    it('should loop through object and return copy of object', () => {
        const response = loopObj(this.obj, (value, key) => {
            expect(this.obj[key]).not.toBeUndefined();

            return value;
        });

        expect(response).toEqual(this.obj);
        expect(response).not.toBe(this.obj);
    });

    it('should loop through object and return updated copy of object', () => {
        const response = loopObj(this.obj, (value, key) => {
            if(key === this.useKey) {
                value = this.newValue;
            }

            return value;
        });

        expect(response).toEqual(this.expected);
        expect(response).not.toBe(this.expected);
    });

    it('should loop through object and allow updates using replying on var reference', () => {
        loopObj(this.obj, (value, key) => {
            if(key === this.useKey) {
                this.obj[key] = this.newValue;
            }

            return value;
        });

        expect(this.obj).toEqual(this.expected);
        expect(this.obj).not.toBe(this.expected);
    });
});

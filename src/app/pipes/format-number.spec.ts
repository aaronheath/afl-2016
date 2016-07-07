import { FormatNumber } from './index';

describe('FormatNumber Pipe', function() {
    let pipe : FormatNumber;

    beforeEach(() => {
        pipe = new FormatNumber();
    });

    it('should transform undefined to undefined', () => {
        expect(pipe.transform(undefined)).toEqual(undefined);
    });

    it('should transform 1000000 to 1,000,000', () => {
        expect(pipe.transform('1000000')).toEqual('1,000,000');
    });
});

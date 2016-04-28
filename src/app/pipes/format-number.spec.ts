import {FormatNumber} from './format-number';

describe('FormatNumber Pipe', function() {
    let pipe : FormatNumber;

    beforeEach(() => {
        pipe = new FormatNumber();
    });

    it('should transform 1000000 to 1,000,000', () => {
        expect(pipe.transform('1000000')).toEqual('1,000,000');
    });
});

import { Pipe, PipeTransform } from '@angular/core';
import 'numeral';

/**
 * Format Number Pipe
 *
 * Formats value (string or number) into number of with comma separated thousands.
 *
 * Examples:
 * 1000.01 = 1,000.01
 * 123456789 = 123,456,789
 */
@Pipe({name: 'formatNumber'})
export class FormatNumber implements PipeTransform {
    transform(value : string | number, args : string[] = []) : string {
        if(typeof value === 'undefined') {
            return;
        }

        return numeral(value).format('0,0');
    }
}

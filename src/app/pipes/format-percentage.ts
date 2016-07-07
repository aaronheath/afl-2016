import 'numeral';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Format Percentage Pipe
 *
 * Formats value (string or number) into number with two decimal places.
 * This satisfies the general rendering of AFL Premiership Ladders.
 *
 * Examples:
 * 99.9 = 99.90
 * 100 = 100.00
 * 123.456 = 123.46
 */
@Pipe({name: 'formatPercentage'})
export class FormatPercentage implements PipeTransform {
    transform(value : any[], args : string[]) : any {
        if(typeof value === 'undefined') {
            return;
        }

        return numeral(value).format('0.00');
    }
}

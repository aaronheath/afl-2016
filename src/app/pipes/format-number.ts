import {Pipe, PipeTransform} from 'angular2/core';
import 'numeral';

@Pipe({name: 'formatNumber'})
export class FormatNumber implements PipeTransform {
    transform(value : any[], args : string[]) : any {
        if(typeof value === 'undefined') {
            return;
        }
        
        return numeral(value).format('0,0');
    }
}

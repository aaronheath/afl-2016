import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'sortMatches'})
export class SortMatches implements PipeTransform {
    transform(value : any[], args : string[]) : any {
        return value.sort((a, b) => this._compare(a, b));
    }

    private _compare(a : IMatch, b : IMatch) {
        return a.local_datetime.localeCompare(b.local_datetime);
    }
}

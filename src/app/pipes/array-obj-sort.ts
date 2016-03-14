import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'arrayObjSort'})
export class ArrayObjSortPipe implements PipeTransform {
    transform(value : any[], args : string[]) : any {
        return value.sort((a, b) => this._compare(a, b));
    }

    private _compare(a, b) {
        return a.local_datetime.localeCompare(b.local_datetime);
    }
}

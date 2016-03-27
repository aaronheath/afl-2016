import {Component, OnInit} from 'angular2/core';
import * as marked from 'marked';

import {ReadmeService} from '../../services/readme';

@Component({
    selector: 'page-readme',
    directives: [
    ],
    template: `
        <h1>Readme</h1>

        <div [innerHTML]="getReadme()"></div>
    `,
})

export class PageReadmeComponent implements OnInit {
    readme;

    constructor(
        private _readmeService: ReadmeService
    ) {}

    ngOnInit() {
        this.readme = this._readmeService.getReadme();

        this._readmeService.observable$.subscribe((data) => {
            this.readme = this._readmeService.getReadme();
        });
    }

    getReadme() {
        return marked.parse(this.readme);
    }
}

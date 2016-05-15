import {Component, OnInit} from '@angular/core';

import {LadderComponent} from '../ladder/ladder';

@Component({
    selector: 'page-ladder',
    directives: [
        LadderComponent
    ],
    template: `
        <h1>AFL 2016 Ladder</h1>

        <ladder></ladder>
    `,
})

export class PageLadderComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}

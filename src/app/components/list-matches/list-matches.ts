import {Component, OnInit} from 'angular2/core';

import {StatsService} from '../../services/stats';
import {ArrayObjSortPipe} from '../../pipes/array-obj-sort';

@Component({
    selector: 'list-matches',
    directives: [],
    pipes: [ArrayObjSortPipe],
    inputs: ['matches'],
    template: `
    <table class="ui celled table">
        <thead>
            <tr>
                <th>Date</th>
                <th>&nbsp;</th>
                <th>G</th>
                <th>B</th>
                <th>Pts</th>
                <th>&nbsp;</th>
                <th>G</th>
                <th>B</th>
                <th>Pts</th>
                <th>Venue</th>
                <th>Venue Time</th>
                <th>Local Time</th>
                <th>Attendance</th>
            </tr>
        </thead>
        <tbody *ngIf="matches">
            <tr *ngFor="#match of matches | arrayObjSort">
                <td>{{ match.h_date }}</td>
                <td [class.positive]="match.result === match.home">{{ match.h_home }}</td>
                <td>{{ match.homeGoals }}</td>
                <td>{{ match.homeBehinds }}</td>
                <td>{{ match.homePoints }}</td>
                <td [class.positive]="match.result === match.away">{{ match.h_away }}</td>
                <td>{{ match.awayGoals }}</td>
                <td>{{ match.awayBehinds }}</td>
                <td>{{ match.awayPoints }}</td>
                <td>{{ match.h_venue }}</td>
                <td>{{ match.h_venue_time }}</td>
                <td>{{ match.h_local_time }}</td>
                <td>{{ match.attendance }}</td>
            </tr>
        </tbody>
    </table>
    `,
})

export class ListMatchesComponent implements OnInit {
    matches;

    constructor() {}

    ngOnInit() {}
}

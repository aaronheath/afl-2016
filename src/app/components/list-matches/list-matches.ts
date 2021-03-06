import { Component, OnInit } from '@angular/core';

import { TimeService } from '../../services/index';
import { FormatNumber } from '../../pipes/index';
import { MatchItem } from '../../models/index';

@Component({
    selector: 'list-matches',
    pipes: [
        FormatNumber,
    ],
    providers: [
        TimeService,
    ],
    inputs: ['matches'],
    template: `
    <table class="ui celled table striped">
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
            <tr *ngFor="let match of matches">
                <td>{{ match.date() }}</td>
                <td [class.positive]="positive(match, 'home')">{{ match.home().get('fullName') }}</td>
                <td>{{ match.get('homeGoals') }}</td>
                <td>{{ match.get('homeBehinds') }}</td>
                <td>{{ match.homePoints() }}</td>
                <td [class.positive]="positive(match, 'away')">{{ match.away().get('fullName') }}</td>
                <td>{{ match.get('awayGoals') }}</td>
                <td>{{ match.get('awayBehinds') }}</td>
                <td>{{ match.awayPoints() }}</td>
                <td>{{ match.venue().get('fullName') }}</td>
                <td>{{ match.time() }}</td>
                <td>{{ localTime(match) }}</td>
                <td>{{ match.get('attendance') | formatNumber }}</td>
            </tr>
        </tbody>
    </table>
    `,
})
export class ListMatchesComponent implements OnInit {
    matches : MatchItem[];

    constructor(private _timeService: TimeService) {}

    ngOnInit() {}

    getTimezone() {
        return this._timeService.getTimezone();
    }

    positive(match, team) {
        return match.result() === match.get(team);
    }

    localTime(match) {
        return match.timeTz(this.getTimezone());
    }
}

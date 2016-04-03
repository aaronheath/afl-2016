import {Component, OnInit} from 'angular2/core';

import {StatsService} from '../../services/stats';
import {FormatPercentage} from '../../pipes/format-percentage';

@Component({
    selector: 'ladder',
    directives: [],
    inputs: [],
    pipes: [
        FormatPercentage
    ],
    template: `
        <table class="ui celled table structured compact striped">
            <thead class="bottom aligned">
                <tr>
                    <th rowspan="2">Team</th>
                    <th rowspan="2">Played</th>
                    <th rowspan="2">Won</th>
                    <th rowspan="2">Lost</th>
                    <th rowspan="2">Drawn</th>
                    <th colspan="3" class="center aligned">For</th>
                    <th colspan="3" class="center aligned">Against</th>
                    <th rowspan="2">%</th>
                    <th rowspan="2">Points</th>
                </tr>
                <tr>
                    <th>Goals</th>
                    <th>Behinds</th>
                    <th>Points</th>
                    <th>Goals</th>
                    <th>Behinds</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="#team of ladder; #i = index" [class.positive]="i < 8">
                    <td>{{ team.h_name }}</td>
                    <td>{{ team.played }}</td>
                    <td><strong>{{ team.wins }}</strong></td>
                    <td><strong>{{ team.losses }}</strong></td>
                    <td><strong>{{ team.draws }}</strong></td>
                    <td>{{ team.goalsFor }}</td>
                    <td>{{ team.behindsFor }}</td>
                    <td>{{ team.pointsFor }}</td>
                    <td>{{ team.goalsAgainst }}</td>
                    <td>{{ team.behindsAgainst }}</td>
                    <td>{{ team.pointsAgainst }}</td>
                    <td><strong>{{ team.percentage | formatPercentage }}</strong></td>
                    <td><strong>{{ team.points }}</strong></td>
                </tr>
            </tbody>
        </table>
    `,
})

export class LadderComponent implements OnInit {
    ladder : ILadderTeam[];

    constructor(
        private _statsService: StatsService
    ) {}

    ngOnInit() {
        this.ladder = this._statsService.getLadder();

        this._statsService.observable$.subscribe((data) => {
            this.ladder = this._statsService.getLadder();
        });
    }
}

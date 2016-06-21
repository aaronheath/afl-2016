import {Component, OnInit} from '@angular/core';

import {StatsService} from '../../services/stats';
import {FormatPercentage} from '../../pipes/format-percentage';

@Component({
    selector: 'ladder',
    directives: [],
    inputs: [],
    pipes: [
        FormatPercentage,
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
                <tr *ngFor="let team of ladder; let i = index" [class.positive]="i < 8">
                    <td><span *ngIf="team.team()">{{ team.team().get('fullName') }}</span></td>
                    <td>{{ team.played() }}</td>
                    <td><strong>{{ team.get('wins') || 0 }}</strong></td>
                    <td><strong>{{ team.get('losses') || 0 }}</strong></td>
                    <td><strong>{{ team.get('draws') || 0 }}</strong></td>
                    <td>{{ team.get('goalsFor') || 0 }}</td>
                    <td>{{ team.get('behindsFor') || 0 }}</td>
                    <td>{{ team.pointsFor() }}</td>
                    <td>{{ team.get('goalsAgainst') || 0 }}</td>
                    <td>{{ team.get('behindsAgainst') || 0 }}</td>
                    <td>{{ team.pointsAgainst() }}</td>
                    <td><strong>{{ team.percentage() | formatPercentage }}</strong></td>
                    <td><strong>{{ team.points() }}</strong></td>
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

import { Component, OnInit } from '@angular/core';

import { zeroUndef } from '../../helpers/utils';
import { StatsService } from '../../services/index';
import { FormatPercentage } from '../../pipes/index';
import { LadderItem } from '../../models/index';

@Component({
    selector: 'ladder',
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
                    <td><strong>{{ teamAttr(team, 'wins') }}</strong></td>
                    <td><strong>{{ teamAttr(team, 'losses') }}</strong></td>
                    <td><strong>{{ teamAttr(team, 'draws') }}</strong></td>
                    <td>{{ teamAttr(team, 'goalsFor') }}</td>
                    <td>{{ teamAttr(team, 'behindsFor') }}</td>
                    <td>{{ team.pointsFor() }}</td>
                    <td>{{ teamAttr(team, 'goalsAgainst') }}</td>
                    <td>{{ teamAttr(team, 'behindsAgainst') }}</td>
                    <td>{{ team.pointsAgainst() }}</td>
                    <td><strong>{{ team.percentage() | formatPercentage }}</strong></td>
                    <td><strong>{{ team.points() }}</strong></td>
                </tr>
            </tbody>
        </table>
    `,
})
export class LadderComponent implements OnInit {
    ladder : LadderItem[];

    constructor(
        private _statsService: StatsService
    ) {}

    ngOnInit() {
        this.ladder = this._statsService.getLadder();

        this._statsService.observable$.subscribe((data) => {
            this.ladder = this._statsService.getLadder();
        });
    }

    teamAttr(team, attr) {
        return zeroUndef(team.get(attr));
    }
}

import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {StatsService} from '../../services/stats';
import {ListMatchesComponent} from '../list-matches/list-matches';

@Component({
    selector: 'page-round',
    directives: [
        ListMatchesComponent
    ],
    template: `
        <h1>Round {{ roundNumber }}</h1>

        <list-matches [matches]="getMatches()"></list-matches>
    `,
})

export class PageRoundComponent implements OnInit {
    matches;
    roundNumber;

    constructor(
        private _routeParams: RouteParams,
        private _statsService: StatsService
    ) {
    }

    ngOnInit() {
        this.roundNumber = this._routeParams.get('roundNumber');

        this.matches = this._statsService.getMatchesByRound(this.roundNumber);

        this._statsService.observable$.subscribe(() => {
            this.matches = this._statsService.getMatchesByRound(this.roundNumber);
        });
    }

    getMatches() {
        return this.matches;
    }
}

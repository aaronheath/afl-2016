import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';

import {StatsService} from '../../services/stats';
import {ListMatchesComponent} from '../list-matches/list-matches';
import {RoundSummaryComponent} from '../round-summary/round-summary';
import {FormatNumber} from '../../pipes/format-number';
import {FormatPercentage} from '../../pipes/format-percentage';

@Component({
    directives: [
        ListMatchesComponent,
        RoundSummaryComponent,
    ],
    pipes: [
        FormatNumber,
        FormatPercentage,
    ],
    selector: 'page-round',
    template: `
        <h1>Round {{ roundNumber }}</h1>

        <div class="ui one column grid">
            <list-matches class="row" [matches]="getMatches()"></list-matches>

            <round-summary class="row" [roundNumber]="roundNumber"></round-summary>
        </div>
    `,
})

export class PageRoundComponent implements OnInit {
    roundNumber : number;
    matches : IMatch[];

    constructor(
        private _routeParams: RouteParams,
        private _statsService: StatsService
    ) {
    }

    ngOnInit() {
        const roundNumber = this._routeParams.get('roundNumber');

        this.roundNumber = parseInt(roundNumber, 10);

        this.matches = this._statsService.getMatchesByRound(this.roundNumber);

        this._statsService.observable$.subscribe(() => {
            this.matches = this._statsService.getMatchesByRound(this.roundNumber);
        });
    }

    /**
     * Returns matches
     *
     * @returns {any}
     */
    getMatches() : IMatch[] {
        return this.matches;
    }
}

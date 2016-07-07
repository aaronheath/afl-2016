import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { MatchesService, StatsService } from '../../services/index';
import { FormatNumber, FormatPercentage } from '../../pipes/index';
import { MatchItem } from '../../models/index';
import { ListMatchesComponent } from '../list-matches/list-matches';
import { RoundSummaryComponent } from '../round-summary/round-summary';

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
    matches : MatchItem[];

    constructor(
        private _routeParams: RouteParams,
        private _statsService: StatsService,
        private _matchesService: MatchesService
    ) {
    }

    ngOnInit() {
        const roundNumber = this._routeParams.get('roundNumber');

        this.roundNumber = parseInt(roundNumber, 10);

        this.matches = this._matchesService.getByRound(this.roundNumber);

        this._statsService.observable$.subscribe(() => {
            this.matches = this._matchesService.getByRound(this.roundNumber);
        });
    }

    /**
     * Returns matches
     *
     * @returns {any}
     */
    getMatches() : MatchItem[] {
        return this.matches;
    }
}

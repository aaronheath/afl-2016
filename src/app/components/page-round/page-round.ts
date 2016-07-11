import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
        private route: ActivatedRoute,
        private router: Router,
        private _statsService: StatsService,
        private _matchesService: MatchesService
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            const roundNumber = params['roundNumber'];

            this.roundNumber = parseInt(roundNumber, 10);

            this.matches = this._matchesService.getByRound(this.roundNumber);

            this._statsService.observable$.subscribe(() => {
                this.matches = this._matchesService.getByRound(this.roundNumber);
            });
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

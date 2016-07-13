import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { MatchesService, StatsService } from '../../services/index';
import { FormatNumber, FormatPercentage } from '../../pipes/index';
import { MatchItem } from '../../models/index';
import { ListMatchesComponent } from '../list-matches/list-matches';
import { RoundSummaryComponent } from '../round-summary/round-summary';

@Component({
    directives: [
        ListMatchesComponent,
        RoundSummaryComponent,
        ROUTER_DIRECTIVES,
    ],
    pipes: [
        FormatNumber,
        FormatPercentage,
    ],
    selector: 'page-round',
    styles: [`
        .round-links a {
            display: inline-block;
            white-space: nowrap;
        }
    `],
    template: `
        <h1>Round {{ roundNumber }}</h1>

        <div class="ui one column grid">
            <list-matches class="row" [matches]="getMatches()"></list-matches>

            <div class="round-links row">
                <div *ngIf="previousRoundExists()" class="left floated column two wide">
                    <a [routerLink]="['/round', previousRoundNo()]" class="ui button">Previous Round</a>
                </div>

                <div *ngIf="nextRoundExists()"  class="right floated column two wide right aligned">
                    <a [routerLink]="['/round', nextRoundNo()]" class="ui button">Next Round</a>
                </div>
            </div>

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

    previousRoundNo() : number {
        return this.roundNumber - 1;
    }

    nextRoundNo() : number {
        return this.roundNumber + 1;
    }

    previousRoundExists() : boolean {
        return this.roundExists(this.previousRoundNo());
    }

    nextRoundExists() : boolean {
        return this.roundExists(this.nextRoundNo());
    }

    private roundExists(roundNo : number) : boolean {
        return this._matchesService.hasRound(roundNo);
    }
}

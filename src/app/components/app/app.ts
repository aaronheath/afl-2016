import { Component, OnChanges, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_DIRECTIVES } from '@angular/router';

// Haven't looked into why yet, however we're unable use barreled imports at this point.
import { MatchesService } from '../../services/matches';
import { MatchSummaryService } from '../../services/match-summary';
import { ReadmeService } from '../../services/readme';
import { StatsService } from '../../services/stats';
import { TeamsService } from '../../services/teams';
import { TimeService } from '../../services/time';
import { VenuesService } from '../../services/venues';

import { FooterComponent } from '../footer/footer';
import { LadderComponent } from '../ladder/ladder';
import { ListMatchesComponent } from '../list-matches/list-matches';
import { PageLadderComponent } from '../page-ladder/page-ladder';
import { PageReadmeComponent } from '../page-readme/page-readme';
import { PageRoundComponent } from '../page-round/page-round';

import { FormatNumber } from '../../pipes/format-number';
import { FormatPercentage } from '../../pipes/format-percentage';

declare const $;

@Component({
    selector: 'my-app',
    directives: [
        FooterComponent,
        ROUTER_DIRECTIVES,
    ],
    providers: [
        HTTP_PROVIDERS,
        // Services
        MatchesService,
        MatchSummaryService,
        ReadmeService,
        StatsService,
        TeamsService,
        TimeService,
        VenuesService,
        // Pipes
        FormatNumber,
        FormatPercentage,
    ],
    styles: [`
        #popup-rounds .ui.link.list {
            white-space: nowrap;
        }
        #popup-rounds .ui.three.column {
            width: 350px;
        }
        .ui.main.container {
            margin-top: 6em;
            margin-bottom: 4em;
            min-height: calc(100vh - 232px);
        }
    `],
    template: `
        <div id="header" class="ui fixed menu inverted">
            <div class="ui container">
                <a [routerLink]="['ladder']"  class="header item nohighlight">AFL 2016</a>

                <a [routerLink]="['ladder']" class="item">Ladder</a>

                <div id="popup-rounds-trigger" class="item dropdown">
                    Round
                    <i class="dropdown icon"></i>
                </div>

                <a [routerLink]="['readme']" class="item">Readme</a>

                <div class="right menu"><!-- --></div>
            </div>
        </div>

        <div id="popup-rounds" class="ui flowing popup top left transition hidden inverted">
            <div class="ui three column divided center aligned grid inverted">
                <div class="column">
                    <div class="ui link list inverted">
                        <div *ngFor="let item of rounds[0]" class="item">
                            <a [routerLink]="['round', item]" class="inverted">Round {{ item }}</a>
                        </div>
                    </div>
                </div>

                <div class="column">
                    <div class="ui link list inverted">
                        <div *ngFor="let item of rounds[1]" class="item">
                            <a [routerLink]="['round', item]" class="inverted">Round {{ item }}</a>
                        </div>
                    </div>
                </div>

                <div class="column">
                    <div class="ui link list inverted">
                        <div *ngFor="let item of rounds[2]" class="item">
                            <a [routerLink]="['round', item]">Round {{ item }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="ui main container">
            <router-outlet></router-outlet>
        </div>

        <site-footer></site-footer>
    `,
})

export class AppComponent implements OnInit, OnChanges {
    rounds : [number[]];

    constructor(
        private _statsService: StatsService,
        private _timeService: TimeService
    ) {}

    ngOnInit() {
        this.rounds = [[]];

        this._statsService.observable$.subscribe((data) => {
            const rounds = this._statsService.getRoundNumbers();

            const third = Math.ceil(rounds.length / 3);

            this.rounds = [
                rounds.slice(0, third),
                rounds.slice(third, 2 * third),
                rounds.slice(2 * third),
            ];

            $('#header .ui.dropdown').dropdown({
                on: 'hover',
            });

            $('#popup-rounds-trigger').popup({
                popup : $('#popup-rounds'),
                hoverable: true,
                position : 'bottom center',
                transition: 'scale',
            });
        });
    }

    ngOnChanges() {
        $('#header .ui.dropdown').dropdown('refresh');
    }
}

import {Component, OnInit, OnChanges} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {MatchesService} from '../../services/matches';
import {TeamsService} from '../../services/teams';
import {VenuesService} from '../../services/venues';
import {StatsService} from '../../services/stats';
import {ReadmeService} from '../../services/readme';
import {TimeService} from '../../services/time';

import {ListMatchesComponent} from '../list-matches/list-matches';
import {PageLadderComponent} from '../page-ladder/page-ladder';
import {PageRoundComponent} from '../page-round/page-round';
import {LadderComponent} from '../ladder/ladder';
import {PageReadmeComponent} from '../page-readme/page-readme';
import {FooterComponent} from '../footer/footer';

import {SortMatches} from '../../pipes/sort-matches';
import {FormatNumber} from '../../pipes/format-number';
import {FormatPercentage} from '../../pipes/format-percentage';

declare const $;

@Component({
    selector: 'my-app',
    directives: [
        ROUTER_DIRECTIVES,
        FooterComponent,
    ],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        // Services
        MatchesService,
        TeamsService,
        VenuesService,
        StatsService,
        ReadmeService,
        TimeService,
        // Pipes
        SortMatches,
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
                <a [routerLink]="['Ladder']"  class="header item nohighlight">AFL 2016</a>

                <a [routerLink]="['Ladder']" class="item">Ladder</a>

                <div id="popup-rounds-trigger" class="item dropdown">
                    Round
                    <i class="dropdown icon"></i>
                </div>

                <a [routerLink]="['Readme']" class="item">Readme</a>

                <div class="right menu"><!-- --></div>
            </div>
        </div>

        <div id="popup-rounds" class="ui flowing popup top left transition hidden inverted">
            <div class="ui three column divided center aligned grid inverted">
                <div class="column">
                    <div class="ui link list inverted">
                        <div *ngFor="#item of rounds[0]" class="item">
                            <a [routerLink]="['Round', {roundNumber: item}]" class="inverted">Round {{ item }}</a>
                        </div>
                    </div>
                </div>

                <div class="column">
                    <div class="ui link list inverted">
                        <div *ngFor="#item of rounds[1]" class="item">
                            <a [routerLink]="['Round', {roundNumber: item}]" class="inverted">Round {{ item }}</a>
                        </div>
                    </div>
                </div>

                <div class="column">
                    <div class="ui link list inverted">
                        <div *ngFor="#item of rounds[2]" class="item">
                            <a [routerLink]="['Round', {roundNumber: item}]">Round {{ item }}</a>
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

@RouteConfig([
    {
        path: '/round/:roundNumber',
        name: 'Round',
        component: PageRoundComponent,
    },
    {
        path: '/ladder',
        name: 'Ladder',
        component: PageLadderComponent,
        useAsDefault: true,
    },
    {
        path: '/readme',
        name: 'Readme',
        component: PageReadmeComponent,
    }
])
export class AppComponent implements OnInit, OnChanges {
    rounds : [number[]];

    constructor(
        private _router : Router,
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

import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {MatchesService} from '../../services/matches';
import {TeamsService} from '../../services/teams';
import {VenuesService} from '../../services/venues';
import {StatsService} from '../../services/stats';

import {ListMatchesComponent} from '../list-matches/list-matches';
import {PageLadderComponent} from '../page-ladder/page-ladder';
import {PageRoundComponent} from '../page-round/page-round';
import {LadderComponent} from '../ladder/ladder';

import {SortMatches} from '../../pipes/sort-matches';
import {OnInit} from "angular2/core";
import {OnChanges} from "angular2/core";

declare const $;

@Component({
    selector: 'my-app',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        MatchesService,
        TeamsService,
        VenuesService,
        StatsService,
        SortMatches,
    ],
    styles: [`
        #popup-rounds .ui.link.list {
            white-space: nowrap;
        }
    `],
    template: `
        <div id="header" class="ui fixed menu inverted">
            <div class="ui container">
                <a class="header item">AFL 2016</a>

                <a class="item">Dashboard</a>

                <div id="popup-rounds-trigger" class="item dropdown">
                    Round
                    <i class="dropdown icon"></i>
                </div>

                <a href="{{ getPathToRoute('Ladder') }}" class="item" (click)="goToRoute($event, 'Ladder')">Ladder</a>

                <div class="right menu"><!-- --></div>
            </div>
        </div>

        <div id="popup-rounds" class="ui flowing popup top left transition hidden inverted">
            <div class="ui three column divided center aligned grid">
                <div class="column">
                    <div class="ui link list inverted">
                        <a *ngFor="#item of rounds[0]"
                            href="{{ getPathToRound(item) }}"
                            (click)="goToRound($event, item)"
                            class="item">Round {{ item }}</a>
                    </div>
                </div>

                <div class="column">
                    <div class="ui link list inverted">
                        <a *ngFor="#item of rounds[1]"
                            href="{{ getPathToRound(item) }}"
                            (click)="goToRound($event, item)"
                            class="item">Round {{ item }}</a>
                    </div>
                </div>

                <div class="column">
                    <div class="ui link list inverted">
                        <a *ngFor="#item of rounds[2]"
                            href="{{ getPathToRound(item) }}"
                            (click)="goToRound($event, item)"
                            class="item">Round {{ item }}</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="ui main container">
            <router-outlet></router-outlet>
        </div>
    `,
})

@RouteConfig([
    {
        path: '/round/:roundNumber',
        name: 'Round',
        component: PageRoundComponent,
        useAsDefault: true,
    },
    {
        path: '/ladder',
        name: 'Ladder',
        component: PageLadderComponent,
    }
])
export class AppComponent implements OnInit, OnChanges {
    rounds : [number[]];

    constructor(
        private _router : Router,
        private _statsService: StatsService
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

    /**
     * Returns path to route
     *
     * @param route
     * @param params
     * @returns {string}
     */
    getPathToRoute(route : string, params : IBasicObj = {}) : string {
        const link = [route, params];

        return this._router.generate(link).urlPath;
    }

    /**
     * Returns path to specific round
     *
     * @param roundNumber
     */
    getPathToRound(roundNumber : number) : void {
        this.getPathToRoute('Round', {roundNumber});
    }

    /**
     * Invokes path change to route in the users browser
     *
     * @param e
     * @param route
     * @param params
     */
    goToRoute(e : Event, route : string, params : IBasicObj = {}) : void {
        e.preventDefault();

        const link = [route, params];

        this._router.navigate(link);
    }

    /**
     * Invokes path change in users browser to specific round
     *
     * @param e
     * @param roundNumber
     */
    goToRound(e : Event, roundNumber : number) : void {
        this.goToRoute(e, 'Round', {roundNumber});
    }
}

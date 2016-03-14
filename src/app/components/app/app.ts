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

import {ArrayObjSortPipe} from '../../pipes/array-obj-sort';
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
        ArrayObjSortPipe,
    ],
    template: `
        <div id="header" class="ui fixed menu inverted">
            <div class="ui container">
                <a class="header item">AFL 2016</a>

                <a class="item">Dashboard</a>

                <div class="ui dropdown item">
                    Round
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        <a *ngFor="#item of rounds"
                            href="{{ getPathToRound(item) }}"
                            (click)="goToRound($event, item)"
                            class="item">{{ item }}</a>
                    </div>
                </div>

                <a href="{{ getPathToRoute('Ladder') }}" class="item" (click)="goToRoute($event, 'Ladder')">Ladder</a>

                <div class="right menu"><!-- --></div>
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
    rounds;

    constructor(
        private _router : Router,
        private _statsService: StatsService
    ) {}

    ngOnInit() {
        this.rounds = [];

        this._statsService.observable$.subscribe((data) => {
            this.rounds = this._statsService.getRoundNumbers();

            $('#header .ui.dropdown').dropdown({
                on: 'hover',
            });
        });
    }

    ngOnChanges() {
        $('#header .ui.dropdown').dropdown('refresh');
    }

    getPathToRoute(route, params = {}) {
        const link = [route, params];

        return this._router.generate(link).urlPath;
    }

    getPathToRound(roundNumber) {
        this.getPathToRoute('Round', {roundNumber});
    }

    goToRoute(e, route, params = {}) {
        e.preventDefault();

        const link = [route, params];

        this._router.navigate(link);
    }

    goToRound(e, roundNumber) {
        this.goToRoute(e, 'Round', {roundNumber});
    }
}

import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {loopObj} from '../helpers/utils';
import {generateLadder} from '../helpers/ladder';
import {generateMatches} from '../helpers/matches';

declare const moment;

import {MatchesService} from './matches';
import {TeamsService} from './teams';
import {VenuesService} from './venues';

@Injectable()
export class StatsService {
    observable$;
    private _observer;
    private _dataStore;
    private __dataStore;

    constructor(
        private _matchesService: MatchesService,
        private _teamsService: TeamsService,
        private _venuesService: VenuesService
    ) {
        this._dataStore = {
            matches: {},
            teams: {},
            venues: {},
            ladder: [],
        };

        this.__dataStore = {
            matches: {},
            teams: {},
            venues: {},
        };

        this.observable$ = new Observable((observer) => {
            this._observer = observer
        }).share();

        this._loadMatches();
        this._loadTeams();
        this._loadVenues();
    }

    private _loadMatches() {
        this._matchesService.observable$.subscribe((data) => {
            this.__dataStore.matches = this._matchesService.getAllMatches();

            this._generateStats();

            this._observer.next(this._dataStore.matches);
        });
    }

    private _loadTeams() {
        this._teamsService.observable$.subscribe((data) => {
            this.__dataStore.teams = this._teamsService.getTeams();

            this._generateStats();

            this._observer.next(this._dataStore.teams);
        });
    }

    private _loadVenues() {
        this._venuesService.observable$.subscribe((data) => {
            this.__dataStore.venues = this._venuesService.getVenues();

            this._generateStats();

            this._observer.next(this._dataStore.venues);
        });
    }

    private _generateStats() {
        this._dataStore.venues = this.__dataStore.venues;

        this._dataStore.teams = this.__dataStore.teams;

        this._dataStore.matches = generateMatches(
            this.__dataStore.matches,
            this._dataStore.teams,
            this.__dataStore.venues
        );

        this._dataStore.ladder = generateLadder(
            this._dataStore.teams,
            this._dataStore.matches
        );
    }

    getMatchesByRound(round) {
        if(typeof this._dataStore.matches[round] === 'undefined') {
            return [];
        }

        return this._dataStore.matches[round];
    }

    getRoundNumbers() {
        return Object.keys(this._dataStore.matches);
    }

    getLadder() {
        return this._dataStore.ladder;
    }
}

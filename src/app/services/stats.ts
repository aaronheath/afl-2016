import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {generateLadder} from '../helpers/ladder';
import {generateMatches} from '../helpers/matches';

declare const moment;

import {MatchesService} from './matches';
import {TeamsService} from './teams';
import {VenuesService} from './venues';

@Injectable()
export class StatsService {
    observable$ : Observable<Subscriber<IStatsDataStore>>;
    private _observer : Subscriber<IStatsDataStore>;
    private _dataStore : IStatsDataStore;
    private _tempDataStore : IStatsTempDataStore;

    constructor(
        private _matchesService: MatchesService,
        private _teamsService: TeamsService,
        private _venuesService: VenuesService
    ) {
        this._dataStore = {
            ladder: [],
            matches: {},
            teams: {},
            venues: {},
        };

        this._tempDataStore = {
            matches: {},
            teams: {},
            venues: {},
        };

        this.observable$ = new Observable((observer) => {
            this._observer = observer;
        }).share();

        this._loadMatches();
        this._loadTeams();
        this._loadVenues();
    }

    /**
     * Subscribes to the MatchesService observable and when next called:
     * - updates the temporary datastore
     * - generates stats
     * - emit update datastore
     *
     * @private
     */
    private _loadMatches() : void {
        this._matchesService.observable$.subscribe((data) => {
            this._tempDataStore.matches = this._matchesService.getAllMatches();

            this._generateStats();

            this._observer.next(this._dataStore);
        });
    }

    /**
     * Subscribes to the TeamsService observable and when next called:
     * - updates the temporary datastore
     * - generates stats
     * - emit update datastore
     *
     * @private
     */
    private _loadTeams() : void {
        this._teamsService.observable$.subscribe((data) => {
            this._tempDataStore.teams = this._teamsService.getTeams();

            this._generateStats();

            this._observer.next(this._dataStore);
        });
    }

    /**
     * Subscribes to the VenuesService observable and when next called:
     * - updates the temporary datastore
     * - generates stats
     * - emit update datastore
     *
     * @private
     */
    private _loadVenues() : void {
        this._venuesService.observable$.subscribe((data) => {
            this._tempDataStore.venues = this._venuesService.getVenues();

            this._generateStats();

            this._observer.next(this._dataStore);
        });
    }

    /**
     * Populates datastore with passed through or generated stats
     *
     * @private
     */
    private _generateStats() : void {
        this._dataStore.venues = this._tempDataStore.venues;

        this._dataStore.teams = this._tempDataStore.teams;

        this._dataStore.matches = generateMatches(
            this._tempDataStore.matches,
            this._dataStore.teams,
            this._tempDataStore.venues
        );

        this._dataStore.ladder = generateLadder(
            this._dataStore.teams,
            this._dataStore.matches
        );
    }

    /**
     * Returns matches for requested round
     *
     * @param round
     * @returns {any}
     */
    getMatchesByRound(round) : IMatch[] {
        if(typeof this._dataStore.matches[round] === 'undefined') {
            return [];
        }

        return this._dataStore.matches[round];
    }

    /**
     * Returns list of rounds
     *
     * @returns {number[]}
     */
    getRoundNumbers() : number[] {
        return Object.keys(this._dataStore.matches).map(key => parseInt(key, 10));
    }

    /**
     * Returns the AFL Ladder
     *
     * @returns {ILadderTeam[]}
     */
    getLadder() : ILadderTeam[] {
        return this._dataStore.ladder;
    }
}

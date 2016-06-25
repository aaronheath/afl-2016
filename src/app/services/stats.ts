import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/skip';

import {generateLadder} from '../helpers/ladder';
import {generateMatches} from '../helpers/matches';
import {generateSummaries} from '../helpers/summaries';
import { Ladder, LadderItem, Match } from '../models/index';

declare const moment;

import {MatchesService} from './matches';
import {TeamsService} from './teams';
import {VenuesService} from './venues';
import {TimeService} from './time';

@Injectable()
export class StatsService {
    observable$ : Observable<Subscriber<IStatsDataStore>>;
    private _observer : Subscriber<IStatsDataStore>;
    private _dataStore : IStatsDataStore;
    private _tempDataStore : IStatsTempDataStore;

    constructor(
        private _matchesService: MatchesService,
        private _teamsService: TeamsService,
        private _venuesService: VenuesService,
        private _timeService: TimeService
    ) {
        this._dataStore = {
            ladder: [],
            matches: {},
            summaries: {},
            teams: {},
            venues: {},
        };

        this._tempDataStore = {
            matches: {},
            teams: {},
            venues: {},
        };

        this.observable$ = new Observable((observer) => {
            //debugger;
            this._observer = observer;

            this._loadMatches();
            this._loadTeams();
            this._loadVenues();
        }).skip(2).share();
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

        if(!Object.keys(this._tempDataStore.matches).length) {
            return;
        }

        this._dataStore.matches = generateMatches(
            this._tempDataStore.matches,
            this._dataStore.teams,
            this._tempDataStore.venues,
            this._timeService.getTimezone()
        );

        this._dataStore.ladder = generateLadder(
            this._dataStore.teams,
            this._dataStore.matches
        );

        this.generateLadder();

        this._dataStore.summaries = generateSummaries(
            this._dataStore.matches
        );
    }

    generateLadder() {
        const matches = Match.wherePlayed();

        Ladder.reset();

        matches.forEach((match) => {
            let homeTeam = Ladder.find(match.get('home'));
            let awayTeam = Ladder.find(match.get('away'));

            if(!homeTeam) {
                homeTeam = Ladder.create({id: match.get('home')});
            }

            if(!awayTeam) {
                awayTeam = Ladder.create({id: match.get('away')});
            }

            // Increment Win/Loss/Draw
            if(match.result() === match.get('home')) {
                homeTeam.set('wins', (homeTeam.get('wins') || 0) + 1);
                awayTeam.set('losses', (awayTeam.get('losses') || 0) + 1);
            } else if(match.result() === match.get('away')) {
                homeTeam.set('losses', (homeTeam.get('losses') || 0) + 1);
                awayTeam.set('wins', (awayTeam.get('wins') || 0) + 1);
            } else {
                homeTeam.set('draws', (homeTeam.get('draws') || 0) + 1);
                awayTeam.set('draws', (awayTeam.get('draws') || 0) + 1);
            }

            // Increment Game Points
            homeTeam.set('goalsFor', (homeTeam.get('goalsFor') || 0) + match.get('homeGoals'));
            homeTeam.set('goalsAgainst', (homeTeam.get('goalsAgainst') || 0) + match.get('awayGoals'));
            homeTeam.set('behindsFor', (homeTeam.get('behindsFor') || 0) + match.get('homeBehinds'));
            homeTeam.set('behindsAgainst', (homeTeam.get('behindsAgainst') || 0) + match.get('awayBehinds'));

            awayTeam.set('goalsFor', (awayTeam.get('goalsFor') || 0) + match.get('awayGoals'));
            awayTeam.set('goalsAgainst', (awayTeam.get('goalsAgainst') || 0) + match.get('homeGoals'));
            awayTeam.set('behindsFor', (awayTeam.get('behindsFor') || 0) + match.get('awayBehinds'));
            awayTeam.set('behindsAgainst', (awayTeam.get('behindsAgainst') || 0) + match.get('homeBehinds'));
        });
    }

    // TODO make this a utility helper


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
    getLadder() : LadderItem[] {
        //return this._dataStore.ladder;
        return Ladder.ranked();
    }

    /**
     * Returns calculated summary for individual round
     *
     * @param round
     * @returns {any}
     */
    getSummaryForRound(round) : IRoundSummary {
        if(!this._dataStore.summaries.rounds || !this._dataStore.summaries.rounds[round]) {
            return;
        }

        return this._dataStore.summaries.rounds[round];
    }
}

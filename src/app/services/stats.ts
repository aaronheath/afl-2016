import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/skip';

//import {generateLadder} from '../helpers/ladder';
//import {generateMatches} from '../helpers/matches';
//import {generateSummaries} from '../helpers/summaries';
import { zeroUndef } from '../helpers/utils';
import { Ladder, LadderItem, Match, MatchItem, TeamItem, VenueItem } from '../models/index';

declare const moment;

import {MatchesService} from './matches';
import {TeamsService} from './teams';
import {VenuesService} from './venues';
import {TimeService} from './time';

//interface IStatsDataStore {
//    matches: IMatches;
//    summaries: ISummaries;
//    teams: TeamItem[];
//    venues: VenueItem[];
//    ladder: ILadderTeam[];
//}
//
//interface IStatsTempDataStore {
//    matches: IMatches;
//    teams: TeamItem[];
//    venues: VenueItem[];
//}

@Injectable()
export class StatsService {
    observable$ : Observable<Subscriber<boolean>>;
    private _observer : Subscriber<boolean>;
    //private _dataStore : IStatsDataStore;
    //private _tempDataStore : IStatsTempDataStore;

    constructor(
        private _matchesService: MatchesService,
        private _teamsService: TeamsService,
        private _venuesService: VenuesService,
        private _timeService: TimeService
    ) {
        //this._dataStore = {
        //    ladder: [],
        //    matches: {},
        //    summaries: {},
        //    teams: [],
        //    venues: [],
        //};
        //
        //this._tempDataStore = {
        //    matches: {},
        //    teams: [],
        //    venues: [],
        //};

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
            //this._tempDataStore.matches = this._matchesService.getAllMatches();

            this._generateStats();

            this._observer.next(true);
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
            //this._tempDataStore.teams = this._teamsService.getTeams();

            this._generateStats();

            this._observer.next(true);
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
            //this._tempDataStore.venues = this._venuesService.getVenues();

            this._generateStats();

            this._observer.next(true);
        });
    }

    /**
     * Populates datastore with passed through or generated stats
     *
     * @private
     */
    private _generateStats() : void {
        //this._dataStore.venues = this._tempDataStore.venues;
        //
        //this._dataStore.teams = this._tempDataStore.teams;
        //
        //if(!Object.keys(this._tempDataStore.matches).length) {
        //    return;
        //}

        //this._dataStore.matches = generateMatches(
        //    this._tempDataStore.matches,
        //    this._dataStore.teams,
        //    this._tempDataStore.venues,
        //    this._timeService.getTimezone()
        //);

        //this._dataStore.ladder = generateLadder(
        //    this._dataStore.teams,
        //    this._dataStore.matches
        //);

        this.generateLadder();

        //this._dataStore.summaries = generateSummaries(
        //    this._dataStore.matches
        //);
    }

    generateLadder() {
        Ladder.reset();

        Match.wherePlayed().forEach((match) => {
            const homeTeam = this.createTeamIfNotFound(match.get('home'));
            const awayTeam = this.createTeamIfNotFound(match.get('away'));

            // Increment Win/Loss/Draw
            if(match.result() === match.get('home')) {
                this.addResultToTeamAttr(homeTeam, 'wins');
                this.addResultToTeamAttr(awayTeam, 'losses');
            } else if(match.result() === match.get('away')) {
                this.addResultToTeamAttr(homeTeam, 'losses');
                this.addResultToTeamAttr(awayTeam, 'wins');
            } else {
                this.addResultToTeamAttr(homeTeam, 'draws');
                this.addResultToTeamAttr(awayTeam, 'draws');
            }

            // Increment Game Points
            this.addScoreToTeamAttr(homeTeam, 'goalsFor', match, 'homeGoals');
            this.addScoreToTeamAttr(homeTeam, 'goalsAgainst', match, 'awayGoals');
            this.addScoreToTeamAttr(homeTeam, 'behindsFor', match, 'homeBehinds');
            this.addScoreToTeamAttr(homeTeam, 'behindsAgainst', match, 'awayBehinds');

            this.addScoreToTeamAttr(awayTeam, 'goalsFor', match, 'awayGoals');
            this.addScoreToTeamAttr(awayTeam, 'goalsAgainst', match, 'homeGoals');
            this.addScoreToTeamAttr(awayTeam, 'behindsFor', match, 'awayBehinds');
            this.addScoreToTeamAttr(awayTeam, 'behindsAgainst', match, 'homeBehinds');
        });
    }

    protected createTeamIfNotFound(team) {
        return Ladder.firstOrCreate([{key: 'id', value: team}], {id: team});
    }

    protected plusOne(value) {
        return zeroUndef(value) + 1;
    }

    protected plusX(value, x) {
        return zeroUndef(value) + x;
    }

    protected addResultToTeamAttr(team, key) {
        team.set(key, this.plusOne(team.get(key)));
    }

    protected addScoreToTeamAttr(team, key, match, matchAttr) {
        team.set(key, this.plusX(team.get(key), match.get(matchAttr)));
    }

    /**
     * Returns matches for requested round
     *
     * @param round
     * @returns {any}
     */
    getMatchesByRound(round) : MatchItem[] {
        return Match.where([{key: 'roundNo', value: round}]).get();
    }

    /**
     * Returns list of rounds
     *
     * @returns {number[]}
     */
    getRoundNumbers() : number[] {
        return Match.roundNumbers();
    }

    /**
     * Returns the AFL Ladder
     *
     * @returns {ILadderTeam[]}
     */
    getLadder() : LadderItem[] {
        return Ladder.ranked();
    }

    /**
     * Returns calculated summary for individual round
     *
     * @param round
     * @returns {any}
     */
    //getSummaryForRound(roundNo) : IRoundSummary {
    //    // Highest Attendance
    //    Match.where([{key: 'roundNo', value: +roundNo}]).orderBy('attendance', 'desc').get();
    //
    //    // Lowest Attendance
    //    Match.where([{key: 'roundNo', value: +roundNo}]).orderBy('attendance').get();
    //
    //    // Overall Attendance
    //    const attendance = Match.where([{key: 'roundNo', value: +roundNo}]).sum('attendance');
    //
    //    // Goals
    //    const homeGoals = Match.where([{key: 'roundNo', value: +roundNo}]).sum('homeGoals');
    //    const awayGoals = Match.where([{key: 'roundNo', value: +roundNo}]).sum('awayGoals');
    //    const goals = homeGoals + awayGoals;
    //
    //    // Behinds
    //    const homeBehinds = Match.where([{key: 'roundNo', value: +roundNo}]).sum('homeBehinds');
    //    const awayBehinds = Match.where([{key: 'roundNo', value: +roundNo}]).sum('awayBehinds');
    //    const behinds = homeBehinds + awayBehinds;
    //
    //    // Points
    //    const points = goals * 6 + behinds;
    //
    //    // Accuracy
    //    const accurancy = goals / (goals + behinds) * 100;
    //
    //    // Highest Scores
    //    const highestHomeScore = Match.where([{key: 'roundNo', value: +roundNo}]).orderBy('homePoints', 'desc', true).get();
    //    const highestAwayScore = Match.where([{key: 'roundNo', value: +roundNo}]).orderBy('awayPoints', 'desc', true).get();
    //    // TODO compare each
    //
    //    // Highest Scores
    //    const lowestHomeScore = Match.where([{key: 'roundNo', value: +roundNo}]).orderBy('homePoints', 'asc', true).get();
    //    const lowestAwayScore = Match.where([{key: 'roundNo', value: +roundNo}]).orderBy('awayPoints', 'asc', true).get();
    //    // TODO compare each
    //
    //    // Played
    //    const played = Match.where([{key: 'roundNo', value: +roundNo}, {key: 'result', value: undefined, operator: '!='}]).count();
    //
    //    return {
    //        matchPlayed: played,
    //        attendance: attendance,
    //    }
    //}


}

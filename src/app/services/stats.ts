import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/skipWhile';

import { zeroUndef } from '../helpers/utils';
import { Ladder, LadderItem, Match, MatchItem } from '../models/index';
import { MatchesService, TeamsService, VenuesService } from '../services/index';

declare const moment;

/**
 * Stats Service
 *
 * Observes data services, upon them having data, triggers aggregate statistic generators. Also, provides access to
 * aggregated statistics.
 */
@Injectable()
export class StatsService {
    /**
     * Observable available for subscription that emits upon greater than two Matches, Teams or Venues observables have
     * been fired.
     */
    observable$;

    protected loaded = new Set();

    /**
     * Sets up observable for this service. As we're wanting data from three services (Matches, Teams and Venues) we
     * skip the first two (n-1) next() calls. Upon any of these observables being called a second or more time, the
     * observable for this method will recieve a next() call. The setting up of the observable assumes that the first
     * three calls of next() will be from the three services. This can be assumed as all services are initialised
     * upon app initialisation.
     *
     * @param matchesService
     * @param teamsService
     * @param venuesService
     * @param timeService
     */
    constructor(
        private matchesService: MatchesService,
        private teamsService: TeamsService,
        private venuesService: VenuesService
    ) {
        this.observable$ = new ReplaySubject(1).skipWhile(() => this.loaded.size < 3);

        this.observable$.subscribe(() => {
            this.generateStats();
        });

        this.loadMatches();
        this.loadTeams();
        this.loadVenues();
    }

    /**
     * Subscribes to the MatchesService observable and when next called:
     * - calls next() on stats observer
     *
     * @protected
     */
    public loadMatches() : void {
        this.matchesService.observable$.subscribe(() => {
            this.loaded.add('matches');
            this.observable$.next();
        });
    }

    /**
     * Subscribes to the TeamsService observable and when next called:
     * - calls next() on stats observer
     *
     * @protected
     */
    protected loadTeams() : void {
        this.teamsService.observable$.subscribe(() => {
            this.loaded.add('teams');
            this.observable$.next();
        });
    }

    /**
     * Subscribes to the VenuesService observable and when next called:
     * - calls next() on stats observer
     *
     * @protected
     */
    protected loadVenues() : void {
        this.venuesService.observable$.subscribe(() => {
            this.loaded.add('venues');
            this.observable$.next();
        });
    }

    /**
     * Populates datastore with passed through or generated stats
     *
     * @protected
     */
    protected generateStats() : void {
        this.generateLadder();
    }

    /**
     * Resets, Ladder model and re-populates LadderItems from played MatchItems.
     */
    generateLadder() : void {
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

    /**
     * Creates team on Ladder model if not found. Returns this teams LadderItem.
     *
     * @param team
     * @returns {LadderItem}
     */
    protected createTeamIfNotFound(team : string) : LadderItem {
        return Ladder.firstOrCreate([{key: 'id', value: team}], {id: team});
    }

    /**
     * Adds one.
     *
     * @param value
     * @returns {any}
     */
    protected plusOne(value : any) : number {
        return zeroUndef(value) + 1;
    }

    /**
     * Adds X.
     *
     * @param value
     * @param x
     * @returns {any}
     */
    protected plusX(value : any, x) : number {
        return zeroUndef(value) + x;
    }

    /**
     * Increments LadderItem attr.
     *
     * @param team
     * @param key
     */
    protected addResultToTeamAttr(team : LadderItem, key : 'wins' | 'losses' | 'draws') : void {
        team.set(key, this.plusOne(team.get(key)));
    }

    /**
     * Adds MatchItem attr to to existing corresponding LadderItem attr.
     *
     * @param team
     * @param key
     * @param match
     * @param matchAttr
     */
    protected addScoreToTeamAttr(team : LadderItem, key : string, match : MatchItem, matchAttr : string) {
        team.set(key, this.plusX(team.get(key), match.get(matchAttr)));
    }

    /**
     * Returns matches for requested round
     *
     * @param round
     * @returns {any}
     */
    getMatchesByRound(round : number) : MatchItem[] {
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
}

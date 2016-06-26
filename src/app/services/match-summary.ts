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
import { Ladder, LadderItem, Match, MatchItem, ModelWhereAttrs, TeamItem, VenueItem } from '../models/index';

export interface RoundSummary {
    goals: number;
    behinds: number;
    totalPoints: number;
    accuracy: number;
    highestScore: MatchItem[];
    lowestScore: MatchItem[];
    attendance: number;
    highestAttendance: MatchItem[];
    lowestAttendance: MatchItem[];
    played: number;
}

@Injectable()
export class MatchSummaryService {
    constructor() {}

    /**
     * Returns calculated summary for individual round
     *
     * @param round
     * @returns {any}
     */
    getSummaryForRound(roundNo) : RoundSummary {
        const where = [{key: 'roundNo', value: +roundNo}];

        const played = this.played(where);

        const highestAttendance = this.highestAttendance(where);

        const lowestAttendance = this.lowestAttendance(where);

        const attendance = this.overallAttendance(where);

        const goals = this.goals(where);

        const behinds = this.behinds(where);

        const points = this.points(goals, behinds);

        const accuracy = this.accuracy(goals, behinds);

        const highestScore = this.highestScore(where);

        const lowestScore = this.lowestScore(where);

        return {
            goals: goals,
            behinds: behinds,
            totalPoints: points,
            accuracy: accuracy,
            highestScore: highestScore,
            lowestScore: lowestScore,
            attendance: attendance,
            highestAttendance: highestAttendance,
            lowestAttendance: lowestAttendance,
            played: played,
        };
    }

    private played(where) {
        const finalWhere = where.concat({key: 'result', value: undefined, operator: '!='});

        return Match.where(finalWhere).count();
    }

    private highestAttendance(where) {
        const sorted = Match.where(where).orderBy('attendance', 'desc').get();

        let attendance;

        return _.takeWhile(sorted, (match) => {
            if(!match.get('attendance') || attendance > match.get('attendance')) {
                return false;
            }

            attendance = match.get('attendance');
        });
    }

    private lowestAttendance(where) {
        const sorted = Match.where(where).orderBy('attendance').get();

        let attendance;

        return _.takeWhile(sorted, (match) => {
            if(!match.get('attendance') || attendance < match.get('attendance')) {
                return false;
            }

            attendance = match.get('attendance');
        });
    }

    private overallAttendance(where : ModelWhereAttrs[]) {
        return Match.where(where).sum('attendance');
    }

    private goals(where : ModelWhereAttrs[]) {
        return this.scores(where, 'Goals');
    }

    private behinds(where : ModelWhereAttrs[]) {
        return this.scores(where, 'Behinds');
    }

    private scores(where : ModelWhereAttrs[], type : 'Goals' | 'Behinds') {
        const home = Match.where(where).sum(`home${type}`);
        const away = Match.where(where).sum(`away${type}`);

        return home + away;
    }

    private points(goals : number, behinds : number) {
        return goals * 6 + behinds;
    }

    private accuracy(goals : number, behinds : number) {
        return goals / (goals + behinds) * 100;
    }

    private highestScore(where) {
        const sortedHomeScores = this.sortedByScore(where, 'homePoints', 'desc');
        const highestHomeScore = this.highestScores(sortedHomeScores, 'homePoints');

        console.log(sortedHomeScores);
        console.log(highestHomeScore);

        const sortedAwayScores = this.sortedByScore(where, 'awayPoints', 'desc');
        const highestAwayScore = this.highestScores(sortedAwayScores, 'awayPoints');

        const mergedScores = highestHomeScore.concat(highestAwayScore);

        return this.takeHighestScore(mergedScores);
    }

    private highestScores(matches, fn) {
        let highestScore;

        return _.takeWhile(matches, (match) => {
            if (!match[fn]() || highestScore > match[fn]()) {
                return false;
            }

            highestScore = match[fn]();
        });
    }

    private takeHighestScore(matches) {
        let response = [];
        let notableScore;

        matches.forEach((match) => {
            if(!response.length && notableScore > match.get('homePoints') && notableScore > match.get('awayPoints')) {
                return;
            }

            const matchNotableScore = match.get('homePoints') > match.get('awayPoints')
                ? match.get('homePoints') : match.get('awayPoints');

            if(matchNotableScore !== matchNotableScore) {
                response = [];
            }

            response.push(match);
        });

        return response;
    }

    private lowestScore(where) {
        const sortedHomeScores = this.sortedByScore(where, 'homePoints', 'asc');
        const lowestHomeScore = this.lowestScores(sortedHomeScores, 'homePoints');

        const sortedAwayScores = this.sortedByScore(where, 'awayPoints', 'asc');
        const lowestAwayScore = this.lowestScores(sortedAwayScores, 'awayPoints');

        const mergedScores = lowestHomeScore.concat(lowestAwayScore);

        return this.takeLowestScore(mergedScores);
    }

    private lowestScores(matches, fn) {
        let lowestScore;

        return _.takeWhile(matches, (match) => {
            if (!match[fn]() || lowestScore < match[fn]()) {
                return false;
            }

            lowestScore = match[fn]();
        });
    }

    private takeLowestScore(matches) {
        let response = [];
        let notableScore;

        matches.forEach((match) => {
            if(!response.length && notableScore < match.get('homePoints') && notableScore < match.get('awayPoints')) {
                return;
            }

            const matchNotableScore = match.get('homePoints') < match.get('awayPoints')
                ? match.get('homePoints') : match.get('awayPoints');

            if(matchNotableScore !== matchNotableScore) {
                response = [];
            }

            response.push(match);
        });

        return response;
    }

    private sortedByScore(where, attr, direction) {
        return Match.where(where).orderBy(attr, direction).get();
    }
}

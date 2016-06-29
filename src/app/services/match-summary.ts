import { Injectable } from '@angular/core';

import { Match, MatchItem, ModelWhereAttrs } from '../models/index';

/**
 * Interface(s)
 */

export interface SummaryOfMatches {
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

/**
 * Match Summary Service
 *
 * Primary purpose is to generate a summary for a given set of matches.
 *
 * TODO:
 * - May .where() calls are made against the Match model. This is expensive. When Model supports optimising this
 * senario we'll be able to optimise this service.
 */
@Injectable()
export class MatchSummaryService {
    /**
     * Summary for an individual AFL Premiership Round.
     *
     * @returns {SummaryOfMatches}
     * @param roundNo
     */
    getSummaryForRound(roundNo : number) : SummaryOfMatches {
        const where = [{key: 'roundNo', value: +roundNo}];

        return this.summaryForQuery(where);
    }

    /**
     * Using where query array a summary of matching matches is returned.
     *
     * @param where
     * @returns {{goals: number, behinds: number, totalPoints: number, accuracy: number, highestScore: MatchItem[],
     * lowestScore: MatchItem[], attendance: number, highestAttendance: MatchItem[], lowestAttendance: MatchItem[],
     * played: number}}
     */
    protected summaryForQuery(where : ModelWhereAttrs[]) : SummaryOfMatches {
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

    /**
     * Count of matches played.
     *
     * @param where
     * @returns {any}
     */
    protected played(where : ModelWhereAttrs[]) : number {
        const finalWhere = where.concat({key: 'result', value: undefined, operator: '!='});

        return Match.where(finalWhere).count();
    }

    /**
     * Array of matches with the highest attendance.
     *
     * @param where
     * @returns {TValue[]}
     */
    protected highestAttendance(where : ModelWhereAttrs[]) : MatchItem[] {
        const sorted = Match.where(where).orderBy('attendance', 'desc').get();

        let attendance;

        return _.takeWhile(sorted, (match) => {
            if(!match.get('attendance') || attendance > match.get('attendance')) {
                return false;
            }

            attendance = match.get('attendance');
        });
    }

    /**
     * Array of matches with the lowest attendance.
     *
     * @param where
     * @returns {TValue[]}
     */
    protected lowestAttendance(where : ModelWhereAttrs[]) : MatchItem[] {
        const sorted = Match.where(where).orderBy('attendance').get();

        let attendance;

        return _.takeWhile(sorted, (match) => {
            if(!match.get('attendance') || attendance < match.get('attendance')) {
                return false;
            }

            attendance = match.get('attendance');
        });
    }

    /**
     * Overall attendance integer for the matches.
     *
     * @param where
     * @returns {number|LoDashExplicitWrapper<number>}
     */
    protected overallAttendance(where : ModelWhereAttrs[]) : number {
        return Match.where(where).sum('attendance');
    }

    /**
     * Goals scored in all matches.
     *
     * @param where
     * @returns {number}
     */
    protected goals(where : ModelWhereAttrs[]) : number {
        return this.scores(where, 'Goals');
    }

    /**
     * Behinds scored in all matches
     *
     * @param where
     * @returns {number}
     */
    protected behinds(where : ModelWhereAttrs[]) : number {
        return this.scores(where, 'Behinds');
    }

    /**
     * Count of goals or behinds scored in all matches.
     *
     * @param where
     * @param type
     * @returns {any}
     */
    protected scores(where : ModelWhereAttrs[], type : 'Goals' | 'Behinds') : number {
        const home = Match.where(where).sum(`home${type}`);
        const away = Match.where(where).sum(`away${type}`);

        return home + away;
    }

    /**
     * Points score that corresponds to given goals and behinds.
     *
     * @param goals
     * @param behinds
     * @returns {number}
     */
    protected points(goals : number, behinds : number) {
        return goals * 6 + behinds;
    }

    /**
     * Shooting accuracy determined by how many goals were scored against all scoring events.
     *
     * @param goals
     * @param behinds
     * @returns {number}
     */
    protected accuracy(goals : number, behinds : number) : number {
        return goals / (goals + behinds) * 100;
    }

    /**
     * Narrows down all matches with those that have the highest score by either a home or away team. The returns
     * an array of matches with the highest individual team score.
     *
     * @param where
     * @returns {MatchItem[]}
     */
    protected highestScore(where : ModelWhereAttrs[]) : MatchItem[] {
        const sortedHomeScores = this.sortedByScore(where, 'homePoints', 'desc');
        const highestHomeScore = this.highestScores(sortedHomeScores, 'homePoints');

        const sortedAwayScores = this.sortedByScore(where, 'awayPoints', 'desc');
        const highestAwayScore = this.highestScores(sortedAwayScores, 'awayPoints');

        const mergedScores = highestHomeScore.concat(highestAwayScore);

        return this.takeHighestScore(mergedScores);
    }

    /**
     * Array of matches with highest scores by either home or away points.
     *
     * @param matches
     * @param fn
     * @returns {MatchItem[]|TValue[]}
     */
    protected highestScores(matches : MatchItem[], fn : string) : MatchItem[] {
        let highestScore;

        return _.takeWhile(matches, (match : MatchItem) => {
            if (!match[fn]() || highestScore > match[fn]()) {
                return false;
            }

            highestScore = match[fn]();
        });
    }

    /**
     * Array of matches with the highest individual team score.
     *
     * @param matches
     * @returns {Array}
     */
    protected takeHighestScore(matches : MatchItem[]) : MatchItem[] {
        let response = [];
        let notableScore;

        matches.forEach((match) => {
            if(!response.length && notableScore > match.get('homePoints') && notableScore > match.get('awayPoints')) {
                return;
            }

            const matchNotableScore = match.get('homePoints') > match.get('awayPoints')
                ? match.get('homePoints') : match.get('awayPoints');

            if(matchNotableScore !== notableScore) {
                response = [];
            }

            response.push(match);
        });

        return response;
    }

    /**
     * Narrows down all matches with those that have the lowest score by either a home or away team. The returns
     * an array of matches with the lowest individual team score.
     *
     * @param where
     * @returns {MatchItem[]}
     */
    protected lowestScore(where : ModelWhereAttrs[]) : MatchItem[] {
        const sortedHomeScores = this.sortedByScore(where, 'homePoints', 'asc');
        const lowestHomeScore = this.lowestScores(sortedHomeScores, 'homePoints');

        const sortedAwayScores = this.sortedByScore(where, 'awayPoints', 'asc');
        const lowestAwayScore = this.lowestScores(sortedAwayScores, 'awayPoints');

        const mergedScores = lowestHomeScore.concat(lowestAwayScore);

        return this.takeLowestScore(mergedScores);
    }

    /**
     * Array of matches with lowest scores by either home or away points.
     *
     * @param matches
     * @param fn
     * @returns {TValue[]}
     */
    protected lowestScores(matches : MatchItem[], fn : string) : MatchItem[] {
        let lowestScore;

        return _.takeWhile(matches, (match) => {
            if (!match[fn]() || lowestScore < match[fn]()) {
                return false;
            }

            lowestScore = match[fn]();
        });
    }

    /**
     * Array of matches with the lowest individual team score.
     *
     * @param matches
     * @returns {Array}
     */
    protected takeLowestScore(matches : MatchItem[]) : MatchItem[] {
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

    /**
     * Array of matches sorted by attribute in desired direction.
     *
     * @param where
     * @param attr
     * @param direction
     * @returns {any}
     */
    protected sortedByScore(where : ModelWhereAttrs[], attr : string, direction : 'asc' | 'desc') : MatchItem[] {
        return Match.where(where).orderBy(attr, direction).get();
    }
}

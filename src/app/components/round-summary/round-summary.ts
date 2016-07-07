import 'lodash';
import { Component, OnInit } from '@angular/core';
import { DomSanitizationService, SafeHtml } from '@angular/platform-browser';

import { MatchSummaryService, StatsService } from '../../services/index';
import { FormatNumber, FormatPercentage } from '../../pipes/index';
import { MatchItem } from '../../models/index';

@Component({
    directives: [],
    inputs: ['roundNumber'],
    pipes: [
        FormatNumber,
        FormatPercentage,
    ],
    selector: 'round-summary',
    template: `
    <div class="ui one column grid">
        <h2>Summary</h2>

        <div class="row" *ngIf="!getSummaryOf('played')">
            <div class="column sixteen wide">
                Matches are yet to be played.
            </div>
        </div>

        <div class="row" *ngIf="getSummaryOf('played')">
            <div class="column sixteen wide">
                <div class="ui small five statistics">
                    <div class="ui statistic">
                        <div class="value">
                            {{ getSummaryOf('attendance') | formatNumber }}
                        </div>
                        <div class="label">Attendance</div>
                    </div>

                    <div class="ui statistic">
                        <div class="value">{{ getSummaryOf('goals') }}</div>
                        <div class="label">Goals</div>
                    </div>

                    <div class="ui statistic">
                        <div class="value">{{ getSummaryOf('behinds') }}</div>
                        <div class="label">Behinds</div>
                    </div>

                    <div class="ui statistic">
                        <div class="value">{{ getSummaryOf('totalPoints') | formatNumber }}</div>
                        <div class="label">Points</div>
                    </div>

                    <div class="ui statistic">
                        <div class="value">
                            {{ getSummaryOf('accuracy') | formatPercentage }}%
                        </div>
                        <div class="label">Accuracy</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" *ngIf="getSummaryOf('played')">
            <div class="column sixteen wide">
                <div class="ui tiny two statistics">
                    <div class="statistic" *ngIf="getHighestScore()">
                        <div class="value" [innerHTML]="getHighestScore()"></div>
                        <div class="label">Highest Score</div>
                    </div>

                    <div class="statistic" *ngIf="getLowestScore()">
                        <div class="value" [innerHTML]="getLowestScore()"></div>
                        <div class="label">Lowest Score</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" *ngIf="getSummaryOf('played')">
            <div class="column sixteen wide">
                <div class="ui tiny two statistics">
                    <div class="statistic" *ngIf="highestAttendance">
                        <div class="value" [innerHTML]="highestAttendance"></div>
                        <div class="label">Highest Attendance</div>
                    </div>

                    <div class="statistic" *ngIf="lowestAttendance">
                        <div class="value" [innerHTML]="lowestAttendance"></div>
                        <div class="label">Lowest Attendance</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
})

export class RoundSummaryComponent implements OnInit {
    roundNumber : number;
    highestAttendance : SafeHtml;
    lowestAttendance : SafeHtml;
    summary;

    constructor(
        private sanitizer: DomSanitizationService,
        private _statsService: StatsService,
        private _matchSummaryService: MatchSummaryService
    ) {}

    ngOnInit() {
        this._statsService.observable$.subscribe(() => {
            this.summary = this._matchSummaryService.getSummaryForRound(this.roundNumber);

            this.highestAttendance = this.getHighestAttendance();
            this.lowestAttendance = this.getLowestAttendance();
        });
    }

    /**
     * Returns summary attr by key
     *
     * @param key
     * @returns {any}
     */
    getSummaryOf(key : string) {
        if(!this.summary) {
            return;
        }

        return this.summary[key];
    }

    /**
     * Returns generated string for highest scoring match(es)
     *
     * @returns {string}
     */
    getHighestScore() : string {
        return this._getScoresSummary('highestScore');
    }

    /**
     * Returns generated string for lowest scoring match(es)
     *
     * @returns {string}
     */
    getLowestScore() : string {
        return this._getScoresSummary('lowestScore');
    }

    /**
     * Generates string for highest and lowest scoring matches
     *
     * @param key
     * @returns {any}
     * @private
     */
    private _getScoresSummary(key : string) : string {
        const matches = this.getSummaryOf(key);

        if(!matches || _.isEmpty(matches)) {
            return;
        }

        const strings = this._getMatchesScoreStringArray(key, matches);

        const iconColor = this._iconColor(key);

        const direction = key === 'highestScore' ? 'up' : 'down';

        return `<i class="angle double ${direction} icon ${iconColor}"></i> ${strings.join(', ')}`;
    }

    /**
     * Assigns variables for use when generating string for individual match for use in high / low scores
     *
     * @param key
     * @param matches
     * @returns {string[]}
     * @private
     */
    private _getMatchesScoreStringArray(key : string, matches : MatchItem[]) {
        return matches.map((match : MatchItem) => {
            let winner, loser, highScore, lowScore;

            if(match.homePoints() > match.awayPoints()) {
                winner = match.home().get('abbreviation');
                loser = match.away().get('abbreviation');
                highScore = match.homePoints();
                lowScore = match.awayPoints();
            }

            if(match.homePoints() < match.awayPoints()) {
                winner = match.away().get('abbreviation');
                loser = match.home().get('abbreviation');
                highScore = match.awayPoints();
                lowScore = match.homePoints();
            }

            return this._getIndMatchScoreString(key, match, winner, loser, highScore, lowScore);
        });
    }

    /**
     * Generates string for individual match for use in high / low scores
     *
     * @param key
     * @param match
     * @param winner
     * @param loser
     * @param highScore
     * @param lowScore
     * @returns {any}
     * @private
     */
    private _getIndMatchScoreString(
        key : string,
        match : MatchItem,
        winner : string,
        loser : string,
        highScore : number,
        lowScore : number
    ) : string {
        if(match.homePoints() === match.awayPoints()) {
            return `${match.awayPoints()} <small>by</small> ${match.home().get('abbreviation')} <small>&</small>
            ${match.away().get('abbreviation')} <small>in drawn game</small>`;
        }

        let firstTeam;
        let secondTeam;
        let score;

        if(key === 'highestScore') {
            firstTeam = winner;
            secondTeam = loser;
            score = highScore;
        } else {
            firstTeam = loser;
            secondTeam = winner;
            score = lowScore;
        }

        return `${score} <small>by</small> ${firstTeam} <small>v</small> ${secondTeam}`;
    }

    /**
     * Returns summary string for highest attended match(es)
     *
     * @returns {string}
     */
    getHighestAttendance() : SafeHtml {
        return this._getAttendance('highestAttendance');
    }

    /**
     * Returns summary string for lowest attended match(es)
     *
     * @returns {string}
     */
    getLowestAttendance() : SafeHtml {
        return this._getAttendance('lowestAttendance');
    }

    /**
     * Generates summary string for highest / lowest attended match(es)
     *
     * @param key
     * @returns {any}
     * @private
     */
    private _getAttendance(key : string) : SafeHtml {
        const matches = this.getSummaryOf(key);

        if(!matches || _.isEmpty(matches)) {
            return;
        }

        let attendance = 0;

        const strings = matches.map((match) => {
            if(!attendance) {
                attendance = match.get('attendance');
            }

            return `<small>at</small> ${match.venue().get('abbreviation')} <small>for</small> ${match.home().get('abbreviation')} <small>v</small>
            ${match.away().get('abbreviation')}`;
        });

        let formattedAttendance = this._formatAttendance(attendance);

        const iconColor = this._iconColor(key);

        return this.toSafeHtml(`<i class="users icon ${iconColor}"></i> ${formattedAttendance} ${strings.join(' & ')}`);
    }

    /**
     * Formats number
     * eg 23531 -> 23,531
     *
     * @param attendance
     * @returns {string}
     * @private
     */
    private _formatAttendance(attendance : number) : string {
        return new FormatNumber().transform(attendance);
    }

    /**
     * Returns green or red depding on whether key is a known 'success' indicator
     *
     * @param key
     * @returns {string}
     * @private
     */
    private _iconColor(key : string) : string {
        const beGreen = [
            'highestScore',
            'highestAttendance',
        ];

        return beGreen.includes(key) ? 'green' : 'red';
    }

    /**
     * Converts string input to SafeHtml
     *
     * @param input
     * @returns {SafeHtml}
     */
    private toSafeHtml(input : string) : SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(input);
    }
}

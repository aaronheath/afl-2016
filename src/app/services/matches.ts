import 'lodash';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

//import {loopMatches} from '../helpers/matches';
import { Match, MatchItem } from '../models/index';

//export interface ApiMatch {
//    home: string;
//    homeGoals?: number;
//    homeBehinds?: number;
//    away: string;
//    awayGoals?: number;
//    awayBehinds?: number;
//    venue: string;
//    date: string;
//    time: string;
//    attendance?: number;
//}
//
//export interface ApiMatches {
//    [roundNumber: number]: ApiMatch[];
//}

@Injectable()
export class MatchesService {
    observable$ : Observable<Subscriber<MatchItem[]>>;
    private _observer : Subscriber<MatchItem[]>;

    constructor(private _http: Http) {
        this.observable$ = new Observable((observer) => {
            this._observer = observer;

            this.load();
        }).share();
    }

    /**
     * Fetch matches data and calls next on observer
     */
    load() : void {
        let observable = this._http.get('/data/matches.json').map(response => response.json());

        observable.subscribe(data => {
            _.forEach(data, (roundMatches, roundNo) => {
                _.forEach(roundMatches, (match) => {
                    Match.updateOrCreate(
                        [
                            {key: 'roundNo', value: roundNo},
                            {key: 'home', value: match.home},
                            {key: 'away', value: match.away},
                        ], {
                            home: match.home,
                            homeGoals: match.homeGoals,
                            homeBehinds: match.homeBehinds,
                            away: match.away,
                            awayGoals: match.awayGoals,
                            awayBehinds: match.awayBehinds,
                            venue: match.venue,
                            date: match.date,
                            time: match.time,
                            attendance: match.attendance,
                            roundNo: +roundNo,
                        }
                    );
                });
            });

            this._observer.next(Match.all());
        }, (error) => {
            console.error('Could not load matches.', error);
        });
    }

    /**
     * Calculates team points and result if goals and points are supplied for both teams.
     * Where a draw has occurred the result attr will be set to 'DRAW'
     *
     * @param data
     * @returns {any|({}&any)}
     * @private
     */
    //private _calculateAttrs(data : IMatches) : IMatches {
    //    return loopMatches(data, (match : IMatch) => {
    //        // Calculate Points
    //        if(typeof match.homeGoals !== 'undefined'
    //            && typeof match.homeBehinds !== 'undefined'
    //            && typeof match.awayGoals !== 'undefined'
    //            && typeof match.awayBehinds !== 'undefined'
    //        ) {
    //            match.homePoints = match.homeGoals * 6 + match.homeBehinds;
    //            match.awayPoints = match.awayGoals * 6 + match.awayBehinds;
    //
    //            match.margin = Math.abs(match.homePoints - match.awayPoints);
    //
    //            // Result
    //            if(match.homePoints > match.awayPoints) {
    //                match.result = match.home;
    //            } else if(match.homePoints < match.awayPoints) {
    //                match.result = match.away;
    //            } else {
    //                match.result = 'DRAW';
    //            }
    //        }
    //
    //        return match;
    //    });
    //}

    /**
     * Returns matches in datastore
     *
     * @returns {IMatches}
     */
    getAllMatches() : MatchItem[] {
        return Match.all();
    }

    getByRound(roundNo) : MatchItem[] {
        return Match.where([{key: 'roundNo', value: +roundNo}]).get();
    }
}

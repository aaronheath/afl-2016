//import { TeamItem, MatchItem } from './models/index';

//import Moment = moment.Moment;
//
//export declare type TTeam =
//    "ADL"
//    | "BL"
//    | "CARL"
//    | "COLL"
//    | "ESS"
//    | "FRE"
//    | "GEEL"
//    | "GC"
//    | "GWS"
//    | "HAW"
//    | "MEL"
//    | "NM"
//    | "PA"
//    | "RICH"
//    | "STK"
//    | "SYD"
//    | "WC"
//    | "WB";
//
//export declare type TDraw = "DRAW";
//
//export declare type TStates =
//    "VIC"
//    | "SA"
//    | "WA"
//    | "TAS"
//    | "NSW"
//    | "QLD"
//    | "ACT"
//    | "NT";

//export interface IMatch {
//    home: TTeam;
//    homeGoals?: number;
//    homeBehinds?: number;
//    homePoints?: number;
//    away: TTeam;
//    awayGoals?: number;
//    awayBehinds?: number;
//    awayPoints?: number;
//    margin?: number;
//    result?: TTeam | TDraw;
//    venue: string;
//    date: string;
//    time: string;
//    attendance?: number;
//    h_home?: string;
//    h_home_abbr?: string;
//    h_away?: string;
//    h_away_abbr?: string;
//    h_venue?: string;
//    h_venue_abbr?: string;
//    venue_moment?: Moment;
//    local_moment?: Moment;
//    local_datetime?: string;
//    h_date?: string;
//    h_venue_time?: string;
//    h_local_time?: string;
//}
//
//export interface IMatches {
//    [roundNumber: number]: IMatch[];
//}

//export interface IMatchesDataStore {
//    matches: IMatches;
//}
//
//export interface ITeam {
//    fullName: string;
//    abbreviation: string;
//    city: string;
//    state: TStates;
//}
//
//export interface ITeams {
//    [team: string]: ITeam;
//}
//
//export interface ITeamsDataStore {
//    teams: ITeams;
//}

//export interface IVenue {
//    fullName: string;
//    abbreviation: string;
//    city: string;
//    state: string;
//    timezone: string;
//}
//
//export interface IVenues {
//    [venue: string]: IVenue;
//}
//
//export interface IVenuesDataStore {
//    venues: IVenues;
//}

//export interface ILadderTeam {
//    wins: number;
//    losses: number;
//    draws: number;
//    goalsFor: number;
//    behindsFor: number;
//    goalsAgainst: number;
//    behindsAgainst: number;
//    h_name?: string;
//    played?: number;
//    pointsFor?: number;
//    pointsAgainst?: number;
//    percentage?: number;
//    points?: number;
//}

//interface IStatsDataStore {
//    matches: IMatches;
//    summaries: ISummaries;
//    teams: TeamItem[];
//    venues: IVenues;
//    ladder: ILadderTeam[];
//}
//
//interface IStatsTempDataStore {
//    matches: IMatches;
//    teams: TeamItem[];
//    venues: IVenues;
//}

//export interface ILadderTeamObj {
//    [team: string]: ILadderTeam;
//}
//
//export declare type IDataLoaders =
//    IMatches
//    | ITeams
//    | IVenues;

//export interface IReadmeDataStore {
//    readme: string;
//}

//export declare type ITimezone = string;

//export interface ISummaries {
//    rounds?: IRoundSummaries;
//}
//
//export interface IRoundSummaries {
//    [roundNumber: number]: IRoundSummary;
//}

//export interface IRoundSummary {
//    goals: number;
//    behinds: number;
//    totalPoints: number;
//    accuracy: number;
//    highestScore: MatchItem[];
//    lowestScore: MatchItem[];
//    attendance: number;
//    highestAttendance: MatchItem[];
//    lowestAttendance: MatchItem[];
//    matchPlayed: boolean;
//}

/**
 * Helpers
 */

//export declare type IBasicObj = IBasicObjStr | IBasicObjNum;
//
//export interface IBasicObjStr {
//    [x: string]: any;
//}
//
//export interface IBasicObjNum {
//    [x: number]: any;
//}

/**
 * Model
 */

//export interface IModelWhereAttrs {
//    key: string;
//    value: any;
//    operator?: string;
//    //dynamicAttr?: boolean;
//}

/**
 * Item
 */

//export interface IItemData {
//    [x: string]: any;
//}
//
//export interface IItem {
//    create(data: IItemData): this;
//    fill(data: IItemData): this;
//    set(key: string, value: any): this;
//    get(keys: string[] | string): any;
//    equals(key: string, value: any): boolean;
//    uid(): symbol;
//    isUid(symbol: symbol): boolean;
//    toObject(): any;
//}

/**
 * ES6 & ES7 FEATURES UNKNOWN TO TYPESCRIPT (AT LEAST FOR NOW)
 *
 * Removes compile error for ES6 Object.assign()
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

/* tslint:disable:interface-name */

interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
    is(a: any, b: any);
}

interface Array<T> {
    includes(x) : boolean;
    find(x) : boolean | void;
}

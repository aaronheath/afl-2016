import Moment = moment.Moment;
declare type TTeam =
    "ADL"
    | "BL"
    | "CARL"
    | "COLL"
    | "ESS"
    | "FRE"
    | "GEEL"
    | "GC"
    | "GWS"
    | "HAW"
    | "MEL"
    | "NM"
    | "PA"
    | "RICH"
    | "STK"
    | "SYD"
    | "WC"
    | "WB";

declare type TDraw = "DRAW";

declare type TStates =
    "VIC"
    | "SA"
    | "WA"
    | "TAS"
    | "NSW"
    | "QLD"
    | "ACT"
    | "NT";

interface IMatch {
    home: TTeam;
    homeGoals?: number;
    homeBehinds?: number;
    homePoints?: number;
    away: TTeam;
    awayGoals?: number;
    awayBehinds?: number;
    awayPoints?: number;
    margin?: number;
    result?: TTeam | TDraw;
    venue: string;
    date: string;
    time: string;
    attendance?: number;
    h_home?: string;
    h_home_abbr?: string;
    h_away?: string;
    h_away_abbr?: string;
    h_venue?: string;
    h_venue_abbr?: string;
    venue_moment?: Moment;
    local_moment?: Moment;
    local_datetime?: string;
    h_date?: string;
    h_venue_time?: string;
    h_local_time?: string;
}

interface IMatches {
    [roundNumber: number]: IMatch[];
}

interface IMatchesDataStore {
    matches: IMatches;
}

interface ITeam {
    fullName: string;
    abbreviation: string;
    city: string;
    state: TStates;
}

interface ITeams {
    [team: string]: ITeam;
}

interface ITeamsDataStore {
    teams: ITeams;
}

interface IVenue {
    fullName: string,
    abbreviation: string,
    city: string,
    state: string,
    timezone: string,
}

interface IVenues {
    [venue: string]: IVenue;
}

interface IVenuesDataStore {
    venues: IVenues;
}

interface ILadderTeam {
    wins: number;
    losses: number;
    draws: number;
    goalsFor: number;
    behindsFor: number;
    goalsAgainst: number;
    behindsAgainst: number;
    h_name?: string;
    played?: number;
    pointsFor?: number;
    pointsAgainst?: number;
    percentage?: number;
    points?: number;
}

interface IStatsDataStore {
    matches: IMatches;
    summaries: ISummaries;
    teams: ITeams;
    venues: IVenues;
    ladder: ILadderTeam[];
}

interface IStatsTempDataStore {
    matches: IMatches;
    teams: ITeams;
    venues: IVenues;
}

interface ILadderTeamObj {
    [team: string]: ILadderTeam;
}

declare type IDataLoaders =
    IMatches
    | ITeams
    | IVenues;

interface IReadmeDataStore {
    readme: string;
}

declare type ITimezone = string;

interface ISummaries {
    rounds?: IRoundSummaries;
}

interface IRoundSummaries {
    [roundNumber: number]: IRoundSummary;
}

interface IRoundSummary {
    goals: number;
    behinds: number;
    totalPoints: number;
    accuracy: number;
    highestScore: IMatch[];
    lowestScore: IMatch[];
    attendance: number;
    highestAttendance: IMatch[];
    lowestAttendance: IMatch[];
    matchPlayed: boolean;
}

/**
 * Helpers
 */

declare type IBasicObj = IBasicObjStr | IBasicObjNum;

interface IBasicObjStr {
    [x: string]: any;
}

interface IBasicObjNum {
    [x: number]: any;
}

/**
 * Model
 */

interface IModelWhereAttrs {
    key: string;
    value: any;
    operator?: string;
}

/**
 * Item
 */

interface IItemData {
    [x: string]: any;
}

interface IItem {
    create(data: IItemData): this;
    fill(data: IItemData): this;
    set(key: string, value: any): this;
    get(keys: string[] | string): any;
    equals(key: string, value: any): boolean;
    uid(): symbol;
    isUid(symbol: symbol): boolean;
    toObject(): any;
}

interface IItemMatch extends IItem {
    result(): string;
}

interface IItemLadder extends IItem {
    result(): string;
}

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

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

interface IMatch {
    home: TTeam;
    homeGoals?: number;
    homeBehinds?: number;
    homePoints: number;
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
}

interface IMatches {
    [roundNumber: number]: IMatch[];
}

interface IMatchesDataStore {
    matches: IMatches;
}

declare type IBasicObj = IBasicObjStr | IBasicObjNum;

interface IBasicObjStr {
    [x: string]: any;
}

interface IBasicObjNum {
    [x: number]: any;
}

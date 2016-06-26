/**
 * Instantiated and export Models.
 *
 * Throughout the app these instantiated models will be the canonical instance.
 */

import {
    LadderItem,
    LadderModel,
    MatchItem,
    MatchModel,
    TeamItem,
    TeamModel,
    VenueItem,
    VenueModel,
} from './index';

const ladder = new LadderModel<LadderItem>(LadderItem);
const match = new MatchModel<MatchItem>(MatchItem);
const team = new TeamModel<TeamItem>(TeamItem);
const venue = new VenueModel<VenueItem>(VenueItem);

export {
    ladder as Ladder,
    match as Match,
    team as Team,
    venue as Venue,
};

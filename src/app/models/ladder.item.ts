import { Item, Team } from './index';

/**
 * LadderItem utilised with LadderModel
 */
export class LadderItem extends Item {
    /**
     * TeamItem for LadderItem's team.
     *
     * @returns {Item}
     */
    team() {
        return Team.find(this.get('id'));
    }

    /**
     * Count of matches played by team.
     *
     * @returns {number}
     */
    played() : number {
        const wins = this.get('wins') || 0;
        const losses = this.get('losses') || 0;
        const draws = this.get('draws') || 0;

        return wins + losses + draws;
    }

    /**
     * Points scored by team.
     *
     * @returns {number}
     */
    pointsFor() : number {
        return this.totalPoints('goalsFor', 'behindsFor');
    }

    /**
     * Points scored against team.
     *
     * @returns {number}
     */
    pointsAgainst() : number {
        return this.totalPoints('goalsAgainst', 'behindsAgainst');
    }

    /**
     * Calculates points from goals and behinds.
     *
     * @param goalsKey
     * @param behindsKey
     * @returns {number}
     */
    totalPoints(goalsKey : string, behindsKey : string) : number {
        const goals = this.get(goalsKey) || 0;
        const behinds = this.get(behindsKey) || 0;

        return goals * 6 + behinds;
    }

    /**
     * The teams percentage based on points scored for and against.
     *
     * @returns {number}
     */
    percentage() : number {
        const pointsFor = this.pointsFor();
        const pointsAgainst = this.pointsAgainst();

        return ((Math.round(pointsFor / pointsAgainst * 10000)) / 100) || 0;
    }

    /**
     * Premiership points scored by the team.
     * 4 points for a win, 2 points for a draw.
     *
     * @returns {number}
     */
    points() : number {
        const wins = this.get('wins') || 0;
        const draws = this.get('draws') || 0;

        return wins * 4 + draws * 2;
    }
}

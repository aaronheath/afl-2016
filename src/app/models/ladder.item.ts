import { Item, Team } from './index';

export class LadderItem extends Item implements IItem {
    team() {
        return Team.find(this.get('id'));
    }

    played() {
        const wins = this.get('wins') || 0;
        const losses = this.get('losses') || 0;
        const draws = this.get('draws') || 0;

        return wins + losses + draws;
    }

    pointsFor() {
        return this.totalPoints('goalsFor', 'behindsFor');
    }

    pointsAgainst() {
        return this.totalPoints('goalsAgainst', 'behindsAgainst');
    }

    totalPoints(goalsKey, behindsKey) {
        const goals = this.get(goalsKey) || 0;
        const behinds = this.get(behindsKey) || 0;

        return goals * 6 + behinds;
    }

    percentage() {
        const pointsFor = this.pointsFor();
        const pointsAgainst = this.pointsAgainst();

        return ((Math.round(pointsFor / pointsAgainst * 10000)) / 100) || 0;
    }

    points() {
        const wins = this.get('wins') || 0;
        const draws = this.get('draws') || 0;

        return wins * 4 + draws * 2;
    }
}

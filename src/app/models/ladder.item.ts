import { Item } from './item';
import TeamModel from './team';

export class LadderItem extends Item implements IItem {
    public team() {
        return TeamModel.find(this.get('id'));
    }

    public played() {
        const wins = this.get('wins') || 0;
        const losses = this.get('losses') || 0;
        const draws = this.get('draws') || 0;

        return wins + losses + draws;
    }

    public pointsFor() {
        return this.totalPoints('goalsFor', 'behindsFor');
    }

    public pointsAgainst() {
        return this.totalPoints('goalsAgainst', 'behindsAgainst');
    }

    private totalPoints(goalsKey, behindsKey) {
        const goals = this.get(goalsKey) || 0;
        const behinds = this.get(behindsKey) || 0;

        return goals * 6 + behinds;
    }

    public percentage() {
        const pointsFor = this.pointsFor();
        const pointsAgainst = this.pointsAgainst();

        return ((Math.round(pointsFor / pointsAgainst * 10000)) / 100) || 0;
    }

    public points() {
        const wins = this.get('wins') || 0;
        const draws = this.get('draws') || 0;

        return wins * 4 + draws * 2;
    }
}

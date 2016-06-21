import {Model} from './model';
import {Item} from './item';
import TeamModel from './team';

declare const moment;

class LadderItem extends Item {
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

class LadderModel extends Model {
    protected fillable = [
        'id',
        'wins',
        'losses',
        'draws',
        'goalsFor',
        'behindsFor',
        'goalsAgainst',
        'behindsAgainst',
    ];

    public ranked() {
        return this.all().sort((a, b) => {
            let compare;

            // Compare points
            compare = b.points() - a.points();

            if(compare !== 0) {
                return compare;
            }

            // Compare percentage
            compare = b.percentage() - a.percentage();

            if(compare !== 0) {
                return compare;
            }

            // Compare pointsFor
            compare = b.pointsFor() - a.pointsFor();

            if(compare !== 0) {
                return compare;
            }

            // Compare name
            return a.team().get('fullName').localeCompare(b.team().get('fullName'));
        });
    }
}

const model = new LadderModel(LadderItem);

export default model;

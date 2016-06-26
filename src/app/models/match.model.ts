import { Item, Model, MatchItem } from './index';

export class MatchModel<T extends Item & MatchItem> extends Model<T> {
    protected fillable = [
        'home',
        'homeGoals',
        'homeBehinds',
        'away',
        'awayGoals',
        'awayBehinds',
        'venue',
        'date',
        'time',
        'attendance',
        'roundNo',
    ];

    public wherePlayed() {
        return this.all().filter((item) => {
            return !!item.result();
        });
    }

    public roundNumbers() {
        const roundNumbers = this.all().map((item) => +item.get('roundNo'));

        return _.uniq(roundNumbers);
    }
}

import { Model, MatchItem } from './index';

export class MatchModel<T extends IItem & MatchItem> extends Model<T> {
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
}

import { inject, setBaseTestProviders, addProviders, async } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import {
    TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS,
    TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
} from '@angular/platform-browser-dynamic/testing';

import { getMatches } from '../../tests/example-data-matches';
import { getTeams } from '../../tests/example-data-teams';
import { getVenues } from '../../tests/example-data-venues';
import { FormatNumber } from '../../pipes/index';
import { Match, Team, Venue } from '../../models/index';
import { ListMatchesComponent } from './list-matches';

setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

describe('ListMatchesComponent', () => {
    const providers = [
        FormatNumber,
    ];

    let matches;

    beforeEach(() => {
        addProviders(providers);

        // Matches
        Match.reset();

        //const matches = [];
        matches = [];

        _.each(getMatches(), (roundMatches, roundNo) => {
            roundMatches.map((indMatch) => {
                matches.push(Object.assign(indMatch, {roundNo: roundNo}));
            });
        });

        matches.forEach((indMatch) => Match.create(indMatch));

        // Teams
        Team.reset();

        const teams = [];

        _.each(getTeams(), (item, id) => {
            teams.push(Object.assign(item, {id: id}));
        });

        teams.forEach((item) => Team.create(item));

        // Venues
        Venue.reset();

        const venues = [];

        _.each(getVenues(), (item, id) => {
            venues.push(Object.assign(item, {id: id}));
        });

        venues.forEach((item) => Venue.create(item));
    });

    it('should render list of matches', async(inject([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(ListMatchesComponent)
            .then((fixture) => {
                const el = fixture.nativeElement;

                fixture.componentInstance.matches = Match.all();

                fixture.detectChanges();

                const matchRowsEls = el.querySelectorAll('tbody tr');

                expect(matchRowsEls.length).toBe(matches.length);

                expect(matchRowsEls[0].children[0].innerHTML).toBe('Thu 24 Mar');
                expect(matchRowsEls[0].children[1].classList.contains('positive')).toBe(true);
                expect(matchRowsEls[0].children[5].classList.contains('positive')).not.toBe(true);
                expect(matchRowsEls[0].children[12].innerHTML).toBe('75,706');

                expect(matchRowsEls[1].children[0].innerHTML).toBe('Sat 26 Mar');
                expect(matchRowsEls[1].children[1].classList.contains('positive')).toBe(true);
                expect(matchRowsEls[1].children[5].classList.contains('positive')).not.toBe(true);
                expect(matchRowsEls[1].children[12].innerHTML).toBe('28,505');

                fixture.destroy();
            })
            .catch((err) => {
                console.log(err);
            });
    })));
});

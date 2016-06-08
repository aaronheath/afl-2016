import {
    beforeEachProviders,
    describe,
    expect,
    inject,
    it,
    setBaseTestProviders,
} from '@angular/core/testing';

import {
    ComponentFixture,
    TestComponentBuilder,
} from '@angular/compiler/testing';

import {
    TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS,
    TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
} from '@angular/platform-browser-dynamic/testing';

import {getMatchesWithPointsAndTimes} from '../../tests/example-data-matches';

import {SortMatches} from '../../pipes/sort-matches';
import {FormatNumber} from '../../pipes/format-number';

import {ListMatchesComponent} from './list-matches';

setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

describe('ListMatchesComponent', () => {
    beforeEachProviders(() => {
        return [
            SortMatches,
            FormatNumber,
        ];
    });

    it('should render list of matches', inject([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(ListMatchesComponent)
            .then((fixture) => {
                const el = fixture.nativeElement;

                fixture.componentInstance.matches = getMatchesWithPointsAndTimes()[1]; // Round 1

                fixture.detectChanges();

                const matchRowsEls = el.querySelectorAll('tbody tr');

                expect(matchRowsEls.length).toBe(9);

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
    }));
});

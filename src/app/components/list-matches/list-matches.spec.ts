import {
    beforeEachProviders,
    ComponentFixture,
    describe,
    expect,
    inject,
    it,
    setBaseTestProviders,
    TestComponentBuilder,
} from 'angular2/testing';

import {TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS} from 'angular2/platform/testing/browser';

import {matches} from '../../../../tests/example-data-matches';

import {SortMatches} from '../../pipes/sort-matches';
import {FormatNumber} from '../../pipes/format-number';

import {ListMatchesComponent} from './list-matches';

describe('ListMatchesComponent', () => {
    setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

    beforeEachProviders(() => {
        return [
            SortMatches,
            FormatNumber,
        ];
    });

    it('should render list of matches', inject([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(ListMatchesComponent)
            .then((fixture : ComponentFixture) => {
                const el = fixture.nativeElement;

                fixture.componentInstance.matches = matches;

                fixture.detectChanges();

                const matchRowsEls = el.querySelectorAll('tbody tr');

                expect(matchRowsEls.length).toBe(1);
                expect(matchRowsEls[0].children[0].innerHTML).toBe('26 July 2016');
                expect(matchRowsEls[0].children[1].classList.contains('positive')).toBe(true);
                expect(matchRowsEls[0].children[12].innerHTML).toBe('56,482');
            })
            .catch((err) => {
                console.log(err);
            });
    }));
});

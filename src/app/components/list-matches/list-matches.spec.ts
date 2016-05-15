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

import {getMatches} from '../../tests/example-data-matches';

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

                fixture.componentInstance.matches = getMatches();

                fixture.detectChanges();

                const matchRowsEls = el.querySelectorAll('tbody tr');

                expect(matchRowsEls.length).toBe(1);
                expect(matchRowsEls[0].children[0].innerHTML).toBe('Tue 26 Jul');
                expect(matchRowsEls[0].children[1].classList.contains('positive')).toBe(true);
                expect(matchRowsEls[0].children[12].innerHTML).toBe('56,482');

                fixture.destroy();
            })
            .catch((err) => {
                console.log(err);
            });
    }));
});

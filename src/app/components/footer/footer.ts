import {Component} from 'angular2/core';
import {TimeService} from '../../services/time';

@Component({
    selector: 'site-footer',
    directives: [],
    inputs: [],
    styles: [`
        .ui.vertical {
            padding-top: 3rem;
            padding-bottom: 3rem;
        }
    `],
    template: `
        <div class="ui vertical inverted segment">
            <div class="ui container grid">
                <div class="three wide column">
                    <h4 class="ui inverted header">Links</h4>

                    <div class="ui list link inverted">
                        <div class="item">
                            <i class="github icon"></i>
                            <div class="content">
                                <a href="https://github.com/aaronheath/afl-2016">Github</a>
                            </div>
                        </div>

                        <div class="item">
                            <i class="twitter icon"></i>
                            <div class="content">
                                <a href="https://twitter.com/bomberaza">Twitter</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="three wide column">
                    <h4 class="ui inverted header">Settings</h4>

                    <div class="ui list link inverted">
                        <div class="item">
                            <i class="location arrow icon"></i>
                            <div class="content">
                                {{ getTimezone() }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})

export class FooterComponent {
    constructor(
        private _timeService: TimeService
    ) {}

    getTimezone() : ITimezone {
        return this._timeService.getTimezone();
    }
}

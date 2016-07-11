import { provideRouter, RouterConfig } from '@angular/router';

import { PageRoundComponent } from './components/page-round/page-round';
import { PageLadderComponent } from './components/page-ladder/page-ladder';
import { PageReadmeComponent } from './components/page-readme/page-readme';

export const routes: RouterConfig = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ladder',
    },
    {
        path: 'round/:roundNumber',
        component: PageRoundComponent,
    },
    {
        path: 'ladder',
        component: PageLadderComponent,
    },
    {
        path: 'readme',
        component: PageReadmeComponent,
    },
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes),
];

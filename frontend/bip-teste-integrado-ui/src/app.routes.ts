import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { HomeComponent } from '@/pages/home/home.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'crud',
                loadChildren: () => import('./app/pages/beneficio/beneficio.routes').then(m => m.routes)
            }
        ]
    }
];
